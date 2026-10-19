import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast, Toaster } from 'react-hot-toast';
import { getSocket } from '@/utils/socket';
import { apiSlice, useSubscribePushMutation } from '@/utils/apiSlice';

const VAPID_PUBLIC_KEY = "BOyeeDPIFCRdlHsl6I0jGDapjItEp0qlgIrjrHzsuz4O4lCDn-792dp8BqEIaYxr6MEksWYQhKm3mdvJVsFetb8";

// Helper for VAPID conversion
const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

/**
 * Global Notification Listener.
 * Renders the Toaster for `react-hot-toast` and listens to Socket.io events.
 * Features automated sound effects, intelligent bundling, and premium styling.
 */
const NotificationListener = () => {
    const user = useSelector(store => store.user);
    const userId = user?._id;
    const dispatch = useDispatch();
    const [subscribePush] = useSubscribePushMutation();
    
    // Ref for the ping sound – created once on mount, never on re-renders
    const audioRef = useRef(null);
    useEffect(() => {
        audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
        return () => { audioRef.current = null; };
    }, []);

    // Handlers for Web Push
    useEffect(() => {
        if (!userId || !('serviceWorker' in navigator) || !('PushManager' in window)) return;

        const setupPush = async () => {
            try {
                // 1. Register SW
                const registration = await navigator.serviceWorker.register('/sw.js');
                
                // 2. Request Permission
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') return;

                // 3. Subscribe
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
                });

                // 4. Send to Backend
                await subscribePush(subscription).unwrap();
            } catch (err) {
                console.warn("WebPush Registration failed:", err.message);
            }
        };

        setupPush();
    }, [userId, subscribePush]);
    
    // Tracking for bundling (senderId -> lastNotificationTime)
    const notificationTracker = useRef({});

    useEffect(() => {
        if (!userId) return;

        const socket = getSocket();
        
        const handleNewNotification = (data) => {
            const { type, senderName, senderPhoto, text } = data;
            
            // Intelligent Bundling: Don't spam if a message from same person came very recently
            const now = Date.now();
            const lastTime = notificationTracker.current[senderName] || 0;
            if (type === "NEW_MESSAGE" && now - lastTime < 5000) {
                 // Option to update an existing toast or just skip
                 return;
            }
            notificationTracker.current[senderName] = now;

            // 🔊 Play Ping Sound (User opted-in by standard interaction usually)
            if (audioRef.current) {
                audioRef.current.play().catch(() => {
                    // Silently fails if user hasn't interacted with DOM yet
                });
            }

            // 🥞 Custom Premium Toast
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-base-300 shadow-2xl rounded-[1.5rem] pointer-events-auto flex ring-1 ring-white/10 backdrop-blur-xl border border-white/5`}>
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 pt-0.5">
                                <img
                                    className="h-12 w-12 rounded-[1rem] object-cover ring-2 ring-primary/20"
                                    src={senderPhoto || "/default-avatar.png"}
                                    alt={senderName}
                                />
                            </div>
                            <div className="ml-4 flex-1">
                                <p className="text-xs font-black uppercase tracking-widest text-primary">
                                    {type.replace("_", " ")}
                                </p>
                                <p className="text-sm font-black text-base-content leading-none mt-1">
                                    {senderName}
                                </p>
                                <p className="mt-1 text-xs text-base-content/60 font-medium line-clamp-1 italic">
                                    {type === "CONNECTION_REQUEST" && "wants to connect with you!"}
                                    {type === "REQUEST_ACCEPTED" && "accepted your request!"}
                                    {type === "NEW_MESSAGE" && text}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-white/5">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-transparent rounded-none rounded-r-[1.5rem] p-4 flex items-center justify-center text-xs font-black uppercase tracking-widest text-base-content/40 hover:text-error transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            ), { duration: 2500 });

            // 🔄 Invalidate Cache to update Navbar Badge count
            dispatch(apiSlice.util.invalidateTags(['Notifications']));
        };

        socket.on("new_notification", handleNewNotification);

        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, [userId, dispatch]);

    return (
        <Toaster 
            position="top-right"
            containerStyle={{
                top: 80,
            }}
        />
    );
};

export default NotificationListener;
