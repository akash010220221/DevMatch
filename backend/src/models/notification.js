import mongoose from "mongoose";

/**
 * Notification Model Schema.
 * Tracks historical events like connection requests, acceptances, and new messages.
 */
const notificationSchema = new mongoose.Schema({
    // User who receives the notification
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
        index: true // Optimized fetching for user's notification list
    },
    // User who triggered the notification (e.g., who sent the request)
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    // The event type: connection request, accepted, or new message
    type: { 
        type: String, 
        enum: ["CONNECTION_REQUEST", "REQUEST_ACCEPTED", "NEW_MESSAGE"], 
        required: true 
    },
    // Status Tracker
    isRead: { 
        type: Boolean, 
        default: false 
    },
    // Flexible link to the source of the notification
    // Could be a ConnectionRequest ID or a Chat Message ID
    relatedId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: false
    }
}, { 
    timestamps: true // Track when events occurred for historical sorting
});

// Compound index for highly optimized unread counts and sorting
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export { Notification };
