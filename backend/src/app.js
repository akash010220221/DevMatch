import "#config/env.js";
import express from "express";
import connectDB from "#config/database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { connectRedis, redisClient } from "#config/redis.js";
import { createGlobalLimiter } from "#config/rateLimiter.js";
import mongoose from "mongoose";
import passport from "passport";
import "#config/passport.js";
import setupAuthRoutes from "#routes/auth.js";
import profileRouter from "#routes/profile.js";
import requestRouter from "#routes/requests.js";
import userRouter from "#routes/user.js";
import paymentRouter from "#routes/payment.js";
import chatRouter from "#routes/chat.js";
import leetcodeRouter from "#routes/leetcode.js";
import notificationsRouter from "#routes/notifications.js";
import initializeSocket from "#utils/socket.js";

const app = express();

// Trust proxy for production (Render/Cloudflare)
// This is required for express-rate-limit to work correctly behind a proxy
app.set("trust proxy", 1);

/** 
 * Standard Middlewares
 */
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

/**
 * Health Check Endpoint
 * Provides system status and database connectivity info
 */
app.get("/api/health", async (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: new Date().toISOString(),
        systems: {
            mongodb: mongoose.connection.readyState === 1 ? 'up' : 'down',
            redis: redisClient.isOpen ? 'up' : 'down'
        }
    };

    try {
        if (healthcheck.systems.mongodb === 'down' || healthcheck.systems.redis === 'down') {
            res.status(503).json(healthcheck);
        } else {
            res.status(200).json(healthcheck);
        }
    } catch (error) {
        healthcheck.message = error;
        res.status(503).json(healthcheck);
    }
});


const server = http.createServer(app);
initializeSocket(server);

/**
 * STARTUP PIPELINE
 */

console.log("🚀 Starting System Initialization...");

connectDB()
    .then(() => {
        console.log("✅ Step 1: MongoDB connected");
        return connectRedis();
    })
    .then(() => {
        console.log("✅ Step 2: Upstash Redis connected");

        // Now that Redis is open, we can safely initialize our limiters
        const globalLimiter = createGlobalLimiter();
        app.use(globalLimiter);

        // Inject the rate limiters into the Auth Router
        const authRouter = setupAuthRoutes();

        // Register Routes
        app.use("/api", authRouter);
        app.use("/api", profileRouter);
        app.use("/api", requestRouter);
        app.use("/api", userRouter);
        app.use("/api", paymentRouter);
        app.use("/api", chatRouter);
        app.use("/api", leetcodeRouter);
        app.use("/api", notificationsRouter);

        // Global Error Handler (MUST be registered AFTER routes)
        app.use((err, req, res, next) => {
            res.header("Content-Type", "application/json");
            const statusCode = err.status || 500;
            res.status(statusCode).json({
                message: err.message || "Internal Server Error"
            });
        });

        console.log("✅ Step 3: Routes & Limiters Registered");

        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`✅ Step 4: Server fully operational on port ${PORT} 🚀`);
        });
    })
    .catch(err => {
        console.error("❌ CRITICAL FAILURE DURING STARTUP:");
        console.error(err);
        process.exit(1);
    });
