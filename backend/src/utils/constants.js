/**
 * Pricing constants for membership plans.
 * Note: Razorpay expects amounts in the smallest currency unit (paise for INR).
 * 100 paise = 1 INR.
 */
const membershipAmount = {
    silver: 30000, // 300.00 INR
    gold: 70000   // 700.00 INR
}

export { membershipAmount };
