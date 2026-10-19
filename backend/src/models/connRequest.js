import mongoose from "mongoose";
/**
 * ConnectionRequest Model Schema.
 * Tracks invitations between users (Pending, Accepted, Ignored, Rejected).
 */
const connectionRequestSchema = new mongoose.Schema({
    // User who initiated the request
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // Recipient user of the request
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // Lifecycle status of the connection
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
}, {
    timestamps: true // Track when request was created and updated
})

// Index for optimizing queries that check relationship between two specific users
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Indexes for fast status-based lookups used in feed, received-requests, and sent-requests routes
connectionRequestSchema.index({ toUserId: 1, status: 1 });
connectionRequestSchema.index({ fromUserId: 1, status: 1 });

/**
 * Validation hook before saving to prevent users from requesting themselves.
 */
connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    }
    next();
})

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

export {
    ConnectionRequest
};
