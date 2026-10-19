import express from "express";
import { userAuth } from "#middlewares/auth.js";
import User from "#models/user.js";
import { Notification } from "#models/notification.js";
import { getIO } from "#utils/socket.js";
import { sendPushNotification } from "#utils/webPush.js";
import { ConnectionRequest } from "#models/connRequest.js";

const router = express.Router();

/**
 * Route to send a connection request (interested or ignored).
 * Handles the initial interaction between two users.
 */
router.post("/request/send/:status/:toUserId", userAuth, async (req, res, next) => {
    try {
        const fromUserId = req.user._id; // Logged in user initiating the request
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // Step 1: Validate intended status
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status })
        }

        // Step 2: Ensure the recipient user exists
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).send("user does not exist");
        }

        // Step 3: Check for existing relationships (requests already sent/received)
        // This prevents duplicate requests or conflicting states
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        })

        if (existingConnectionRequest) {
            return res.status(400).send("connection request already exists")
        }

        // Step 4: Create and save the new connection request
        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        })
        const data = await connectionRequest.save();

        if (status === "interested") {
            try {
                // Create Record
                const notification = new Notification({
                    recipient: toUserId,
                    sender: fromUserId,
                    type: "CONNECTION_REQUEST",
                    relatedId: data._id
                });
                await notification.save();

                // Live Emit
                const io = getIO();
                io.to(toUserId.toString()).emit("new_notification", {
                    type: "CONNECTION_REQUEST",
                    senderName: req.user.firstName,
                    senderPhoto: req.user.photoUrl
                });

                // Web Push
                sendPushNotification(toUserId, {
                    title: "New Connection Request! 🤝",
                    body: `${req.user.firstName} wants to connect with you on devMatch!`,
                    icon: req.user.photoUrl || "/favicon.ico",
                    data: { url: "/requests" }
                });
            } catch (err) {
                console.error("Notification Error:", err.message);
            }
        }

        res.json({
            message: status + " " + toUser.firstName,
            data,
        })

    } catch (err) {
        err.status = 400;
        next(err);
    }
})

/**
 * Route to review (accept/reject) a received connection request.
 * Only the recipient of the "interested" request can review it.
 */
router.post("/request/review/:status/:id", userAuth, async (req, res, next) => {
    try {
        const loggedInUser = req.user;

        const status = req.params.status;
        const requestId = req.params.id;

        // Step 1: Validate desired review status
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type: " + status })
        }

        // Step 2: Find the specific pending request aimed at the current user
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id, // Must be addressed to the logged-in user
            status: "interested"        // Status must be 'interested' to be reviewable
        })

        if (!connectionRequest) {
            return res.status(404).json({ message: "connection request not found" })
        }

        // Step 3: Update the status and save
        connectionRequest.status = status;
        const data = await connectionRequest.save();

        if (status === "accepted") {
            try {
                // Create Record
                const notification = new Notification({
                    recipient: connectionRequest.fromUserId,
                    sender: loggedInUser._id,
                    type: "REQUEST_ACCEPTED",
                    relatedId: connectionRequest._id
                });
                await notification.save();

                // Live Emit
                const io = getIO();
                io.to(connectionRequest.fromUserId.toString()).emit("new_notification", {
                    type: "REQUEST_ACCEPTED",
                    senderName: loggedInUser.firstName,
                    senderPhoto: loggedInUser.photoUrl
                });

                // Web Push
                sendPushNotification(connectionRequest.fromUserId, {
                    title: "Request Accepted! 🎉",
                    body: `${loggedInUser.firstName} accepted your connection request on devMatch!`,
                    icon: loggedInUser.photoUrl || "/favicon.ico",
                    data: { url: "/connections" }
                });
            } catch (err) {
                console.error("Acceptance Notification Error:", err.message);
            }
        }

        res.json({ message: "connection request " + status, data })
    } catch (err) {
        err.status = 400;
        next(err);
    }
})

/**
 * Route to withdraw (unsend) a connection request.
 * Only the owner of the request can withdraw it.
 */
router.delete("/request/withdraw/:id", userAuth, async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const requestId = req.params.id;

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            fromUserId: loggedInUser._id,
            status: "interested"
        });

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        await ConnectionRequest.findByIdAndDelete(requestId);

        res.json({ message: "Connection request withdrawn successfully" });
    } catch (err) {
        err.status = 400;
        next(err);
    }
})

export default router;
