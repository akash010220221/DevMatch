import { io } from "socket.io-client";
import { SERVER_URL } from "./constant";

let socket;

/**
 * Global Socket Connection Manager.
 * Ensures only one socket instance is active across the application.
 */
export const getSocket = () => {
    if (!socket) {
        socket = io(SERVER_URL, {
            withCredentials: true,
            autoConnect: false // We trigger connect() manually when user is authenticated
        });
    }
    return socket;
};

export const connectSocket = () => {
    const s = getSocket();
    if (!s.connected) {
        s.connect();
    }
};

export const disconnectSocket = () => {
    if (socket && socket.connected) {
        socket.disconnect();
    }
};