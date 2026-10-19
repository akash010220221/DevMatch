/**
 * Centralized configuration for authentication and security cookies.
 * Used for storing JWT after login and signup.
 */
const cookieConfig = {
    httpOnly: true, // XSS Protection: Prevents client-site scripts from reading the cookie
    secure: true,   // Transport Security: Only transmits via HTTPS
    sameSite: "none", // Cross-Site Compatibility: Allows cookies in cross-origin requests (e.g., frontend on different domain)
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Lifetime: Persistent for 7 days
}

export default cookieConfig;
