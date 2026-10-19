import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import GitHubStrategy from "passport-github2";
import User from "#models/user.js";

/**
 * Passport Configuration
 * Handles logic for Google and GitHub authentication, 
 * automatically linking accounts by email if they already exist.
 */

const verifyCallback = async (profile, done) => {
    try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (!email) {
            return done(new Error("Email address not found in social profile"), null);
        }

        // 1. Link or Find existing user by Email
        let user = await User.findOne({ emailId: email });

        if (user) {
            // Update provider IDs if they haven't been linked yet
            let updated = false;
            if (profile.provider === 'google' && !user.googleId) {
                user.googleId = profile.id;
                updated = true;
            } else if (profile.provider === 'github' && !user.githubId) {
                user.githubId = profile.id;
                updated = true;
            }
            
            // Mark as verified if they successfully logged in via social
            if (!user.isVerified) {
                user.isVerified = true;
                updated = true;
            }

            if (updated) await user.save();
        } else {
            // 2. Create new user if not found
            user = new User({
                firstName: profile.name?.givenName || profile.username || "Developer",
                lastName: profile.name?.familyName || "",
                emailId: email,
                photoUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
                isVerified: true,
                [profile.provider === 'google' ? 'googleId' : 'githubId']: profile.id
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
};

// --- [ GOOGLE STRATEGY ] ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => verifyCallback(profile, done)));

// --- [ GITHUB STRATEGY ] ---
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/api/auth/github/callback",
    scope: ['user:email']
}, (accessToken, refreshToken, profile, done) => verifyCallback(profile, done)));

export default passport;
