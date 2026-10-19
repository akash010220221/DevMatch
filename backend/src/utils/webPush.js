import webPush from "web-push";
import User from "#models/user.js";

const vapidDetails = {
    subject: "mailto:akashkrsingh1104@gmail.com", // Replace with your support email
    publicKey: process.env.VAPID_PUBLIC_KEY,
    privateKey: process.env.VAPID_PRIVATE_KEY
};

webPush.setVapidDetails(
    vapidDetails.subject,
    vapidDetails.publicKey,
    vapidDetails.privateKey
);

/**
 * Send a web push notification to all subscribed devices of a user.
 */
export const sendPushNotification = async (recipientId, payload) => {
    try {
        const user = await User.findById(recipientId).select("pushSubscriptions");
        if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) return;

        const results = await Promise.allSettled(
            user.pushSubscriptions.map(sub => 
                webPush.sendNotification(sub, JSON.stringify(payload))
                    .catch(async (err) => {
                        // If subscription is expired or invalid (404/410), remove it
                        if (err.statusCode === 404 || err.statusCode === 410) {
                            await User.updateOne(
                                { _id: recipientId },
                                { $pull: { pushSubscriptions: sub } }
                            );
                        }
                        throw err;
                    })
            )
        );

        return results;
    } catch (err) {
        console.error("WebPush Global Error:", err.message);
    }
};

export default webPush;
