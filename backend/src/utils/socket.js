import { Server } from "socket.io";
import crypto from "crypto";
import { Chat, Message } from "#models/chat.js";
import { ConnectionRequest } from "#models/connRequest.js";
import User from "#models/user.js";
import { Notification } from "#models/notification.js";
import { sendPushNotification } from "#utils/webPush.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

let io;

/**
 * WebSocket utility using Socket.io for real-time messaging.
 */

// Generate a deterministic and unique room ID based on user pairs
const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex");
}

/**
 * Socket.io server initialization and event management.
 * Handles authentication, room logic, and event-based communication.
 */
const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true
        },
    })

    /**
     * Socket Authentication Middleware
     * Validates connection attempts by checking JWT token from cookies.
     */
    io.use(async (socket, next) => {
        try {
            const cookiesHeader = socket.handshake.headers.cookie;
            if (!cookiesHeader) {
                console.log("Socket Auth Error: No cookies found in handshake");
                return next(new Error("Authentication error"));
            }

            // Extract token robustly by parsing the cookie string
            const tokenCookie = cookiesHeader.split("; ").find(c => c.startsWith("token="));
            if (!tokenCookie) {
                console.log("Socket Auth Error: Token cookie not found");
                return next(new Error("Authentication error"));
            }
            const token = tokenCookie.slice(tokenCookie.indexOf("=") + 1);

            // Verify JWT
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (jwtErr) {
                console.log("Socket Auth Error: JWT Verify Failed:", jwtErr.message);
                return next(new Error("Authentication error"));
            }

            if (!decoded) {
                console.log("Socket Auth Error: Decoded payload is null");
                return next(new Error("Authentication error"));
            }

            // Prefetch user details once and attach to socket session
            // This avoids redundant DB calls inside frequent events like "sendMessage"
            const user = await User.findById(decoded._id).select("firstName lastName photoUrl");
            if (!user) {
                console.log("Socket Auth Error: User document not found for ID:", decoded._id);
                return next(new Error("User not found"));
            }

            socket.user = user;
            next();
        } catch (err) {
            console.error("Socket Auth Exception:", err);
            next(new Error("Authentication error"));
        }
    });

    /**
     * Handle incoming socket connections
     */
    io.on("connection", (socket) => {
        const personalRoom = socket.user._id.toString();
        socket.join(personalRoom);
        console.log(`[SOCKET] User "${socket.user.firstName}" connected (id: ${personalRoom}, socketId: ${socket.id})`);

        // Listen for requests to join a private chat room between two users
        socket.on("joinChat", ({ userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId); // Client joins their unique specific room
        })

        // Listen for new chat messages with Acknowledgment (Optimistic UI)
        socket.on("sendMessage", async ({ userId, targetUserId, chatId: clientChatId, text, tempId, messageType = "text", fileUrl, fileName }, callback) => {
            try {
                const roomId = getSecretRoomId(userId, targetUserId)
                const { firstName, lastName } = socket.user;
                const normalizedType = ["text", "image", "file"].includes(messageType) ? messageType : "text";
                const trimmedText = typeof text === "string" ? text.trim() : "";

                if (normalizedType === "text" && !trimmedText) {
                    throw new Error("Message text is required.");
                }
                if ((normalizedType === "image" || normalizedType === "file") && !fileUrl) {
                    throw new Error("File URL is required for media messages.");
                }

                // 1. Prioritize Broadcast to RECIPIENT (Exclude sender since they have it optimistically)
                socket.to(roomId).emit("messageReceived", {
                    senderId: userId,
                    firstName,
                    lastName,
                    text: normalizedType === "text" ? trimmedText : "",
                    messageType: normalizedType,
                    fileUrl,
                    fileName,
                    tempId // Shared for reconciliation if needed
                });

                // 2. Resolve chatId – use the one provided by the client if valid, otherwise query DB
                let chatId = null;
                if (clientChatId) {
                    // Validate that both users are actual participants of this chat
                    const validChat = await Chat.findOne({
                        _id: clientChatId,
                        participants: { $all: [userId, targetUserId] }
                    }).select("_id");
                    if (validChat) {
                        chatId = validChat._id;
                    }
                }
                if (!chatId) {
                    let chat = await Chat.findOne({
                        participants: { $all: [userId, targetUserId] }
                    });
                    if (!chat) {
                        chat = new Chat({ participants: [userId, targetUserId] });
                        await chat.save();
                    }
                    chatId = chat._id;
                }

                const newMessage = new Message({
                    chatId,
                    senderId: userId,
                    text: normalizedType === "text" ? trimmedText : "",
                    messageType: normalizedType,
                    fileUrl,
                    fileName
                });

                const savedMsg = await newMessage.save();

                // 2.5: Persistent Notification for Message
                try {
                    // Check if recipient is already in this specific chat room
                    const recipientRoom = io.sockets.adapter.rooms.get(roomId);
                    const isRecipientInRoom = recipientRoom && Array.from(recipientRoom).some(sid => {
                        const s = io.sockets.sockets.get(sid);
                        return s && s.user._id.toString() === targetUserId.toString();
                    });

                    // Only notify if they AREN'T in the direct chat room
                    if (!isRecipientInRoom) {
                        // Create Record
                        const notification = new Notification({
                            recipient: targetUserId,
                            sender: userId,
                            type: "NEW_MESSAGE",
                            relatedId: chatId
                        });
                        await notification.save();

                        // Global Emit
                        io.to(targetUserId.toString()).emit("new_notification", {
                            type: "NEW_MESSAGE",
                            senderName: firstName,
                            senderPhoto: socket.user.photoUrl,
                            text: normalizedType === "text" ? trimmedText : `sent an ${normalizedType}`
                        });

                        // Web Push
                        sendPushNotification(targetUserId, {
                            title: `New Message from ${firstName}! 💬`,
                            body: normalizedType === "text" ? trimmedText : `Sent a ${normalizedType}`,
                            icon: socket.user.photoUrl || "/favicon.ico",
                            tag: `dm-chat-${chatId}`, // Group notifications for same chat
                            data: { url: `/chat/${userId}` }
                        });
                    }
                } catch (notifErr) {
                    console.error("Message Notification Error:", notifErr.message);
                }

                // 3. Acknowledge the SENDER with the real DB ID
                if (typeof callback === "function") {
                    callback({
                        status: "ok",
                        _id: savedMsg._id,
                        tempId
                    });
                }
            } catch (err) {
                console.error("Socket Error (sendMessage):", err);
                if (typeof callback === "function") {
                    callback({ status: "error", error: err.message, tempId });
                }
            }
        })

        socket.on("disconnect", () => {
            // Cleanup or logging on disconnect can be added here
        })

        /**
         * VIDEO CALLING SIGNALING (WebRTC Relay)
         */
        // Initiate a call (Sends Offer)
        socket.on("callUser", ({ userToCall, signalData, from, name, photo, type }) => {
            const targetRoom = userToCall?.toString();
            if (!targetRoom) return;

            console.log(`[VIDEO_CALL] Initiating: ${name} (${from}) -> ${targetRoom} [${type || 'video'}]`);

            // Broadcast to all sockets belonging to target user
            io.to(targetRoom).emit("incomingCall", {
                signal: signalData,
                from,
                name,
                photo,
                type: type || 'video'
            });
        });

        // Answer a call (Sends Answer)
        socket.on("answerCall", ({ to, signal }) => {
            const targetRoom = to?.toString();
            if (!targetRoom) return;

            console.log(`[VIDEO_CALL] Accepted: sending answer to ${targetRoom}`);
            io.to(targetRoom).emit("callAccepted", signal);
        });

        // Decline a call
        socket.on("rejectCall", ({ to }) => {
            const targetRoom = to?.toString();
            if (!targetRoom) return;

            console.log(`[VIDEO_CALL] Rejected: notifying ${targetRoom}`);
            io.to(targetRoom).emit("callRejected");
        });

        // Hang up or leave call
        socket.on("endCall", ({ to }) => {
            const targetRoom = to?.toString();
            if (!targetRoom) return;

            console.log(`[VIDEO_CALL] Ended: notifying ${targetRoom}`);
            io.to(targetRoom).emit("callEnded");
        });
    })


}

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
}

export default initializeSocket;
