import express from "express";
import { userAuth } from "#middlewares/auth.js";
import Payment from "#models/payment.js";
import { membershipAmount } from "#utils/constants.js";
import User from "#models/user.js";

import paymentService from "#services/paymentService.js";

const router = express.Router();

/**
 * Route to initiate a new premium subscription payment.
 * Creates a Razorpay order via the payment service.
 */
router.post("/payment/create", userAuth, async (req, res, next) => {
    try {
        const { membershipType } = req.body;
        // Delegate order creation logic to service layer
        const savedPayment = await paymentService.createPayment(req.user, membershipType);

        // Send payment details and public Razorpay Key to frontend to trigger UI
        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
    } catch (err) {
        next(err);
    }
})

/**
 * Route to verify the outcome of a payment.
 * Validates the HMAC signature provided by Razorpay frontend.
 */
router.post("/payment/verify", userAuth, async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Perform server-side validation of the signature
        const payment = await paymentService.verifyPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        return res.json({
            success: true,
            message: "Payment verified successfully",
            payment,
        });
    } catch (err) {
        console.error("Payment verify error:", err);
        // Specifically handle signature mismatches as user-facing errors
        if (err.message === "Invalid signature") {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
        return res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
