import express from "express";
import bcrypt from "bcrypt";
import { validateSignUpData } from "#utils/validation.js";
import User from "#models/user.js";
import cookieConfig from "#config/cookieConfig.js";
import { redisClient } from "#config/redis.js";
import { createAuthLimiter, createOtpLimiter } from "#config/rateLimiter.js";
import sendEmail from "#utils/sendEmail.js";
import { OTP_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "#utils/emailTemplates.js";
import crypto from "crypto";
import validator from "validator";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * Shared Callback handler post-social-auth
 * Passes token via URL to the frontend since cross-domain cookie setting
 * during 302 redirects is blocked by modern browsers.
 */
const handleAuthRedirect = async (req, res) => {
    try {
        const user = req.user;
        const token = await user.getJWT();
        res.redirect(`${process.env.FRONTEND_URL}/auth/social-callback?token=${token}`);
    } catch (err) {
        res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
}

/**
 * Higher Order Route Factory
 * This allows us to inject the rate limiters ONLY when the server starts,
 * avoiding the 'ClientClosedError' at import time.
 */

const setupAuthRoutes = () => {
    const authLimiter = createAuthLimiter();
    const otpLimiter = createOtpLimiter();

    router.post("/signup", authLimiter, async (req, res, next) => {
        try {
            validateSignUpData(req);
            const { firstName, lastName, age, gender, emailId, password } = req.body;
            const existingUser = await User.findOne({ emailId });
            if (existingUser) {
                if (existingUser.isVerified) {
                    return res.status(400).json({ message: "User already exists" });
                } else {
                    // Smart Scenario: User exists but is unverified (perhaps OTP expired)
                    const otp = crypto.randomInt(100000, 999999).toString();
                    await redisClient.set(emailId, otp, { EX: 600 });

                    const html = OTP_TEMPLATE(existingUser.firstName, otp);
                    await sendEmail(emailId, "Verify Your devMatch Account", html);

                    return res.status(200).json({ message: "Account pending verification. A fresh OTP has been sent." });
                }
            }

            const otp = crypto.randomInt(100000, 999999).toString();

            await redisClient.set(emailId, otp, { EX: 600 });

            // Clean Template Implementation
            const html = OTP_TEMPLATE(firstName, otp);
            await sendEmail(emailId, "Verify Your devMatch Account", html);

            const user = new User({ firstName, lastName, age, gender, emailId, password, isVerified: false });
            await user.save();
            res.status(200).json({ message: "OTP sent to your email." });
        } catch (err) { next(err); }
    });

    router.post("/verify-otp", authLimiter, async (req, res, next) => {
        try {
            const { emailId, otp } = req.body;
            const storedOtp = await redisClient.get(emailId);
            if (!storedOtp || storedOtp !== otp) return res.status(400).json({ message: "Invalid or expired OTP" });

            const user = await User.findOne({ emailId });
            if (!user) return res.status(404).json({ message: "User not found" });

            user.isVerified = true;
            await user.save();
            await redisClient.del(emailId);

            const token = await user.getJWT();
            res.cookie("token", token, cookieConfig);
            res.status(200).json({ message: "Verified successfully", user });
        } catch (err) { next(err); }
    });

    router.post("/resend-otp", otpLimiter, async (req, res, next) => {
        try {
            const { emailId } = req.body;
            const user = await User.findOne({ emailId });
            if (!user || user.isVerified) return res.status(400).json({ message: "Invalid request" });

            const otp = crypto.randomInt(100000, 999999).toString();
            await redisClient.set(emailId, otp, { EX: 600 });

            const html = OTP_TEMPLATE(user.firstName, otp);
            await sendEmail(emailId, "New OTP - devMatch", html);
            res.status(200).json({ message: "New OTP sent" });
        } catch (err) { next(err); }
    });

    router.post("/login", authLimiter, async (req, res, next) => {
         try {
            const { emailId, password } = req.body;
            const user = await User.findOne({ emailId });
            if (!user) throw new Error("invalid credentials");

            if (!user.isVerified) {
                // Auto-trigger new OTP for unverified users trying to login
                const otp = crypto.randomInt(100000, 999999).toString();
                await redisClient.set(emailId, otp, { EX: 600 });
                const html = OTP_TEMPLATE(user.firstName, otp);
                await sendEmail(emailId, "Verify Your devMatch Account", html);

                return res.status(403).json({ message: "Email not verified. A fresh OTP has been sent to your inbox." });
            }


            const isValid = await user.validatePassword(password);
            if (isValid) {
                const token = await user.getJWT();
                res.cookie("token", token, cookieConfig).send(user);
            } else throw new Error("invalid credentials");
        } catch (err) { next(err); }
    });

    router.post("/logout", (req, res) => {
        res.cookie("token", null, { ...cookieConfig, expires: new Date(0) }).send("Logout Successful");
    });

    router.post("/forgot-password", otpLimiter, async (req, res, next) => {
        try {
            const { emailId } = req.body;
            const user = await User.findOne({ emailId });
            if (!user) return res.status(404).json({ message: "Email not registered" });

            const resetToken = crypto.randomBytes(32).toString("hex");
            await redisClient.set(`reset:${resetToken}`, emailId, { EX: 900 });

            const link = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            const html = PASSWORD_RESET_TEMPLATE(link);
            await sendEmail(emailId, "Password Reset Request - devMatch", html);
            res.status(200).json({ message: "Reset link sent" });
        } catch (err) { next(err); }
    });

    router.post("/reset-password", async (req, res, next) => {
        try {
            const { token, newPassword } = req.body;

            // Strength Check
            if (!validator.isStrongPassword(newPassword)) {
                return res.status(400).json({ message: "Password is too weak. Must include 8 chars, uppercase, number, and symbol." });
            }

            const emailId = await redisClient.get(`reset:${token}`);
            if (!emailId) return res.status(400).json({ message: "Expired link" });

            const user = await User.findOne({ emailId });

            user.password = newPassword;
            await user.save();
            await redisClient.del(`reset:${token}`);
            res.status(200).json({ message: "Password updated" });
        } catch (err) { next(err); }
    });

    // --- [ SOCIAL AUTH ROUTES ] ---

    // Google
    router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
    router.get("/auth/google/callback", 
        passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }), 
        handleAuthRedirect
    );

    // GitHub
    router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
    router.get("/auth/github/callback", 
        passport.authenticate("github", { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login` }), 
        handleAuthRedirect
    );
    // Token Exchange: Frontend sends the token (from URL) and gets a proper httpOnly cookie
    router.post("/auth/social/exchange", async (req, res, next) => {
        try {
            const { token } = req.body;
            if (!token) return res.status(400).json({ message: "Token is required" });

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded._id);
            if (!user) return res.status(404).json({ message: "User not found" });

            res.cookie("token", token, cookieConfig);
            res.json(user);
        } catch (err) {
            res.status(401).json({ message: "Invalid or expired token" });
        }
    });

    return router;
};

export default setupAuthRoutes;
