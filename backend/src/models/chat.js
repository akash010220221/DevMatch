import mongoose from "mongoose";
/**
 * Chat Model Schemas.
 * Defines individual messages and the overall chat container between users.
 */

// Main chat schema representing a conversation thread
const chatSchema = new mongoose.Schema({
    // The two users participating in the chat
    participants: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ]
}, { timestamps: true });

// Index for fast participant-based lookups (used in every $all query)
chatSchema.index({ participants: 1 });

const Chat = mongoose.model("Chat", chatSchema);

// Schema for individual messages within a chat, stored in their own collection
const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true,
        index: true // Index for fast cursor-based pagination
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String, // Can be empty if it's just an image/file
    },
    messageType: {
        type: String,
        enum: ["text", "image", "file"],
        default: "text",
    },
    fileUrl: {
        type: String, // Link to Cloudinary or generic file storage
    },
    fileName: {
        type: String,
    }
}, {
    timestamps: true // Track when each message was sent
});

// Index to optimize reverse chronological fetches per chat room
messageSchema.index({ chatId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export { Chat, Message };
