import validator from "validator";

/**
 * Data validation utilities for user-provided inputs.
 */

// Basic email and password strength validation for registration
const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("enter a strong password");
    }
}

// Logic to ensure profile updates are both permitted (white-listed fields) and valid
const validateProfileEditData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "photoUrl", "gender", "about", "age", "skills", "githubUsername", "leetcodeUsername", "linkedinUrl", "portfolioUrl", "headline"];

    // Check if any non-permitted fields are presence in the body
    const isAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));

    if (!isAllowed) return false;

    const { firstName, lastName, age, photoUrl } = req.body;

    // Perform specific value-level validation
    if (firstName && firstName.length < 3) throw new Error("First name must be at least 3 characters");
    if (lastName && lastName.length < 3) throw new Error("Last name must be at least 3 characters");
    if (age && (age < 18 || age > 60)) throw new Error("Age must be between 18 and 60");
    if (photoUrl && !validator.isURL(photoUrl)) throw new Error("Photo URL is invalid");

    return true;
}

export {
    validateSignUpData,
    validateProfileEditData
};
