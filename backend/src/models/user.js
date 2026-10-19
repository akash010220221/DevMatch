import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * User Model Schema definition and methods.
 * Defines the structure of the user document and includes business logic for auth.
 */
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,

        validate(value) {
            // Ensure email format is valid
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email address:" + value)
            }
        }
    },
    password: {
        type: String,
        required: function () {
            // Password only required for native email/pass accounts
            return !(this.googleId || this.githubId);
        },
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null values
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true,
    },
    age: {
        type: Number,
        min: 18,
        max: 60,
        default: 18
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not valid gender type`
        },
        default: "others"
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    membershipType: {
        type: String,
    },
    photoUrl: {
        type: String,
        validate(value) {
            // Ensure profile photo URL is valid
            if (!validator.isURL(value)) {
                throw new Error("Invalid Photo URL:" + value)
            }
        },
        default: "https://imgs.search.brave.com/RIJ78YvOZhv5816VrwB5tzHiPRFlP8twQoBuoPsjRmk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ1/MTU4NzgwNy92ZWN0/b3IvdXNlci1wcm9m/aWxlLWljb24tdmVj/dG9yLWF2YXRhci1v/ci1wZXJzb24taWNv/bi1wcm9maWxlLXBp/Y3R1cmUtcG9ydHJh/aXQtc3ltYm9sLXZl/Y3Rvci5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9eURKNElU/WDFjSE1oMjVMdDF2/STF6Qm4yY0FLS0Fs/QnlIQnZQSjhnRWlJ/Zz0",
    },
    about: {
        type: String,
        default: "Default value",
    },
    skills: {
        type: [String],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    githubUsername: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
    },
    leetcodeUsername: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
    },
    linkedinUrl: {
        type: String,
        trim: true,
        validate(value) {
            if (value && !validator.isURL(value)) {
                throw new Error("Invalid LinkedIn URL");
            }
        }
    },
    portfolioUrl: {
        type: String,
        trim: true,
        validate(value) {
            if (value && !validator.isURL(value)) {
                throw new Error("Invalid Portfolio URL");
            }
        }
    },
    headline: {
        type: String,
        trim: true,
        maxLength: 30,
        default: "Full Stack Developer"
    },
    pushSubscriptions: {
        type: Array, // Stores objects from PushManager.subscribe()
        default: []
    }
}, {
    timestamps: true, // Auto-manage createdAt and updatedAt fields
});

// Optimization for searching users by name
userSchema.index({ firstName: 1, lastName: 1 });

/**
 * Filter sensitive information when document is serialized to JSON.
 */
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password; // Never send password to frontend
    return userObject;
}

/**
 * Generate a JWT token for authentication for the current user.
 */
userSchema.methods.getJWT = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return token;
}

/**
 * Compare plain text password input with stored hash.
 */
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const valid = await bcrypt.compare(passwordInputByUser, user.password);
    return valid;
}

/**
 * Pre-save middleware to hash passwords before storing in database.
 */
userSchema.pre("save", async function (next) {
    const user = this;
    // Only re-hash if password is newly set or changed and NOT null
    if (user.isModified("password") && user.password) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

const User = mongoose.model("User", userSchema);

export default User;
