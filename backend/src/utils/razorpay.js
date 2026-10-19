/**
 * Razorpay SDK initialization.
 * Creates a global instance used for interacting with the Razorpay API.
 */
import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

// Create singleton instance with API credentials
var instance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
});

export default instance;
