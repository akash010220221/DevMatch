import razorpayInstance from "#utils/razorpay.js";
import Payment from "#models/payment.js";
import User from "#models/user.js";
import crypto from "crypto";
import mongoose from "mongoose";
import { membershipAmount } from "#utils/constants.js";

/**
 * Service class to handle payment-related business logic.
 * Integrates with Razorpay for order creation and verification.
 */
class PaymentService {
    /**
     * Create a new payment order in Razorpay and record it in our local DB.
     * 
     * @param {Object} user - Authenticated user document.
     * @param {string} membershipType - Selected plan ('silver', 'gold', etc.).
     * @returns {Promise} - The saved Payment document.
     */
    async createPayment(user, membershipType) {
        // Validate that the requested plan exists
        if (!membershipAmount[membershipType]) {
            throw new Error("Invalid membership type");
        }

        const { firstName, lastName, emailId } = user;

        // Step 1: Request order creation from Razorpay API
        const order = await razorpayInstance.orders.create({
            "amount": membershipAmount[membershipType],
            "currency": "INR",
            "receipt": "receipt_" + Date.now(), // Generate a unique receipt ID
            "notes": {
                firstName,
                lastName,
                emailId,
                membershipType: membershipType,
            }
        });

        // Step 2: Initialize a 'created' payment record in our local database
        const payment = new Payment({
            userId: user._id,
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
        });

        return await payment.save();
    }

    /**
     * Verify payment status using HMAC signature verification.
     * Uses MongoDB Transactions to ensure both Payment and User records are updated atomically.
     */
    async verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
        // Step 1: Re-calculate the expected signature using our secret
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        // Security check: Match calculated signature against the one provided by client/Razorpay
        if (generatedSignature !== razorpay_signature) {
            throw new Error("Invalid signature");
        }

        // Step 2: Start an atomic transaction for database updates
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update the local payment record to 'paid'
            const payment = await Payment.findOneAndUpdate(
                { orderId: razorpay_order_id },
                {
                    paymentId: razorpay_payment_id,
                    status: "paid",
                },
                { new: true, session }
            );

            if (!payment) {
                throw new Error("Payment record not found");
            }

            // Grant premium status to the user
            const user = await User.findOne({ _id: payment.userId }).session(session);
            user.isPremium = true;
            user.membershipType = payment.notes.membershipType;
            await user.save({ session });

            // Finalize changes if everything succeeded
            await session.commitTransaction();
            session.endSession();

            return payment;
        } catch (error) {
            // Roll back all changes if any step fails
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
}

export default new PaymentService();
