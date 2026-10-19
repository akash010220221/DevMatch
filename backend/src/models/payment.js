import mongoose from "mongoose";
/**
 * Payment Model Schema.
 * Tracks subscription and transaction state for premium memberships.
 */
const paymentSchema = new mongoose.Schema({
    // User who made the payment
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // ID returned by Razorpay after successful payment
    paymentId: {
        type: String,
    },
    // Order ID created by backend via Razorpay standard API
    orderId: {
        type: String,
        required: true,
    },
    // Current state of payment (e.g., 'created', 'paid', 'failed')
    status: {
        type: String,
        required: true,
    },
    // Transaction amount in smallest currency unit (paise for INR)
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    // Custom receipt identifier 
    receipt: {
        type: String,
        required: true,
    },
    // Metadata passed to Razorpay for logging and reconciliation
    notes: {
        type: Object,
        required: true,
    },
}, {
    timestamps: true
})

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
