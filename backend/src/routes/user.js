import express from "express";
import { userAuth } from "#middlewares/auth.js";
import { ConnectionRequest } from "#models/connRequest.js";
import User from "#models/user.js";

const router = express.Router();

/**
 * Route to fetch all pending connection requests received by the current user.
 * Populates sender details (name, photo, etc.).
 */
router.get("/user/requests/received", userAuth, async (req, res, next) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 40 ? 40 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", "firstName lastName photoUrl age gender about skills")
            .skip(skip)
            .limit(limit);

        res.json({
            message: "fetched all requests",
            data: connectionRequests
        });
    } catch (err) {
        err.status = 400;
        next(err);
    }
})

router.get("/user/requests/sent", userAuth, async (req, res, next) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 40 ? 40 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            fromUserId: loggedInUser._id,
            status: "interested",
        }).populate("toUserId", "firstName lastName photoUrl age gender about skills")
            .skip(skip)
            .limit(limit);

        res.json({
            message: "fetched all sent requests",
            data: connectionRequests
        });
    } catch (err) {
        err.status = 400;
        next(err);
    }
})

/**
 * Route to fetch all active connections (accepted relationships).
 * Returns the profile of the "other" person in the connection.
 */
router.get("/user/connections", userAuth, async (req, res, next) => {
    try {
        const loggedInUser = req.user;

        // Find all requests where the status is 'accepted' involving the current user
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ],
        }).populate("fromUserId", "firstName lastName age gender photoUrl about")
            .populate("toUserId", "firstName lastName age gender photoUrl about");

        // Format data to only return the other user's profile info
        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ data });

    } catch (err) {
        err.status = 400;
        next(err);
    }
})

/**
 * Route to fetch the exploration feed for the user.
 * Discovers users they haven't interacted with yet.
 * Includes pagination support via query params.
 */
router.get("/feed", userAuth, async (req, res, next) => {
    try {
        const loggedInUser = req.user;

        // Pagination setup
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit; // Safety cap on page size
        const skip = (page - 1) * limit;

        // Step 1: Identify everyone the user has already sent/received a request to/from
        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId");

        // Step 2: Build a unique set of IDs to hide from the feed (including themselves)
        const hideUsersFromFeed = new Set([loggedInUser._id.toString()]);
        connectionRequests.forEach(conn => {
            hideUsersFromFeed.add(conn.fromUserId.toString());
            hideUsersFromFeed.add(conn.toUserId.toString());
        });

        // Step 3: Find users not in the 'hide' set, with pagination and selection of safe fields
        const users = await User.find({
            _id: { $nin: Array.from(hideUsersFromFeed) }
        }).select("firstName lastName age gender about skills photoUrl")
            .skip(skip)
            .limit(limit);

        res.json({ data: users });
    } catch (err) {
        next(err);
    }
})

export default router;
