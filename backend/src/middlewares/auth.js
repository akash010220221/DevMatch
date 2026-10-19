import jwt from "jsonwebtoken";
import User from "#models/user.js";
import { redisClient } from "#config/redis.js";

const USER_CACHE_TTL = 300; // 5 minutes

/**
 * Authentication Middleware for the DevMatch application.
 * Verifies the presence and validity of a JWT token stored in a cookie.
 * Attaches the authenticated user document to the request object.
 * User documents are cached in Redis to avoid a DB round-trip on every request.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const userAuth = async (req, res, next) => {
    try {
        // Retrieve token from the request cookies
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send("Please Login!!");
        }

        // Verify the JWT token using the secret stored in env variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = decoded;

        // Try to serve from Redis cache first to avoid a DB round-trip
        const cacheKey = `user:${_id}`;
        try {
            if (redisClient.isOpen) {
                const cached = await redisClient.get(cacheKey);
                if (cached) {
                    // Hydrate a full Mongoose document so .save() / isModified() still work
                    req.user = User.hydrate(JSON.parse(cached));
                    return next();
                }
            }
        } catch (cacheErr) {
            // Non-fatal: fall through to DB on cache error
            console.error("Auth cache read error:", cacheErr.message);
        }

        // Cache miss – fetch from database
        const user = await User.findById(_id);

        if (!user) {
            throw new Error("user not found");
        }

        // Populate cache for subsequent requests
        try {
            if (redisClient.isOpen) {
                await redisClient.setEx(cacheKey, USER_CACHE_TTL, JSON.stringify(user.toObject()));
            }
        } catch (cacheErr) {
            console.error("Auth cache write error:", cacheErr.message);
        }

        // Attach authenticated user to the request for use in route handlers
        req.user = user;
        next();
    } catch (err) {
        // Respond with Unauthorized if token is invalid or user doesn't exist
        res.status(401).send(err.message);
    }
}

/**
 * Invalidate a user's cached document (call after profile mutations).
 */
const invalidateUserCache = async (userId) => {
    try {
        if (redisClient.isOpen) {
            await redisClient.del(`user:${userId}`);
        }
    } catch (err) {
        console.error("Auth cache invalidation error:", err.message);
    }
};

export {
    userAuth,
    invalidateUserCache
};
