import express from 'express';
import axios from 'axios';
import { redisClient } from '#config/redis.js';

const router = express.Router();

const LEETCODE_CACHE_TTL = 3600; // 1 hour

/**
 * Proxy route for LeetCode GraphQL API to avoid CORS issues on the frontend.
 * Responses are cached in Redis for 1 hour to reduce external API calls.
 */
router.post('/leetcode', async (req, res, next) => {
    try {
        const username = req.body.variables?.username;
        const operationName = req.body.operationName;
        const cacheKey = username && operationName ? `lc:${operationName}:${username}` : null;

        // Serve from cache if available
        if (cacheKey && redisClient.isOpen) {
            try {
                const cached = await redisClient.get(cacheKey);
                if (cached) {
                    return res.json(JSON.parse(cached));
                }
            } catch (cacheErr) {
                console.error("LeetCode cache read error:", cacheErr.message);
            }
        }

        const response = await axios.post('https://leetcode.com/graphql', req.body, {
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
            }
        });

        // Populate cache for future requests
        if (cacheKey && redisClient.isOpen) {
            try {
                await redisClient.setEx(cacheKey, LEETCODE_CACHE_TTL, JSON.stringify(response.data));
            } catch (cacheErr) {
                console.error("LeetCode cache write error:", cacheErr.message);
            }
        }

        res.json(response.data);
    } catch (error) {
        console.error('LeetCode Proxy Error:', error.message);
        res.status(error.response?.status || 500).json({
            message: 'Error fetching data from LeetCode',
            error: error.message
        });
    }
});

export default router;
