import express from "express";
import { userAuth, invalidateUserCache } from "#middlewares/auth.js";
import { validateProfileEditData } from "#utils/validation.js";
import User from "#models/user.js";
import validator from "validator";
import bcrypt from "bcrypt";
import upload from "#middlewares/multer.js";
import cloudinary from "#config/cloudinary.js";

const router = express.Router();

/**
 * Route to view the authenticated user's own profile.
 * Retrieves user data from the req.user object attached by auth middleware.
 */
router.get("/profile/view", userAuth, async (req, res, next) => {
    try {
        const user = req.user;
        res.send(user)
    } catch (err) {
        next(err);
    }
})

/**
 * Route to edit profile details.
 * Validates fields before updating the user document in the database.
 */
router.patch("/profile/edit", userAuth, async (req, res, next) => {
    try {
        // Run input validation (checks keys and values)
        if (!validateProfileEditData(req)) {
            throw new Error("Invalid edit request")
        }

        const loggedUser = req.user;

        // Dynamically update user fields based on request body
        Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));

        // Persist changes to database. Mongoose handles validation of values.
        await loggedUser.save();

        // Invalidate the cached user document so the next request gets fresh data
        await invalidateUserCache(loggedUser._id);

        res.json({
            message: `${loggedUser.firstName} ! your profile updated successfully`,
            data: loggedUser
        })

    } catch (err) {
        next(err);
    }
})

/**
 * Route to upload profile photo to Cloudinary.
 */
router.post("/profile/upload", userAuth, upload.single("profilePhoto"), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload to Cloudinary from buffer
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "devMatch/profiles",
                    transformation: [{ width: 500, height: 500, crop: "limit" }],
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        res.json({
            message: "Photo uploaded successfully",
            photoUrl: result.secure_url
        });

    } catch (err) {
        next(err);
    }
})

/**
 * Route to change user password.
 * Requires current password verification and strong new password validation.
 */
router.patch("/profile/password", userAuth, async (req, res, next) => {
    try {
        const { password, newPassword } = req.body;
        const loggedUser = req.user;

        // Step 1: Verify current password
        const isValid = await loggedUser.validatePassword(password);

        if (!isValid) {
            return res.status(400).send("invalid password")
        }

        // Step 2: Validate new password strength
        const isStrongPassword = validator.isStrongPassword(newPassword);
        if (!isStrongPassword) {
            return res.status(400).send("weak password")
        }

        // Step 3: Update and save (hashing happens in User model pre-save hook)
        loggedUser.password = newPassword;
        await loggedUser.save();

        // Invalidate cached user document after credential change
        await invalidateUserCache(loggedUser._id);

        res.send("password updated successfully")

    } catch (err) {
        next(err);
    }
})


export default router;
