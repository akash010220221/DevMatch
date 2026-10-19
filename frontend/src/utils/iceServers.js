/**
 * WebRTC ICE Server Configuration
 * 
 * Provides a robust set of STUN and TURN servers for NAT traversal.
 * In development, STUN is often enough. In production, TURN is mandatory.
 */

const getIceServers = () => {
    // Standard public STUN servers
    const servers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
    ];

    // Optional TURN server from environment variables
    const turnUrl = import.meta.env.VITE_TURN_URL;
    const turnUsername = import.meta.env.VITE_TURN_USERNAME;
    const turnPassword = import.meta.env.VITE_TURN_PASSWORD;

    if (turnUrl && turnUsername && turnPassword) {
        servers.push({
            urls: turnUrl,
            username: turnUsername,
            credential: turnPassword
        });
    }

    return servers;
};

export default getIceServers;
