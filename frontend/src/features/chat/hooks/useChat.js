import { useEffect, useState, useRef } from 'react';
import { useSelector } from "react-redux";
import { getSocket } from '@/utils/socket';
import { useGetChatQuery, useGetConnectionsQuery, useSignChatUploadMutation } from '@/utils/apiSlice';
import imageCompression from 'browser-image-compression';
import React from 'react';

// Stable empty array – prevents useEffect from running spuriously when chatData is undefined
const EMPTY_MESSAGES = [];

export const useChat = (targetUserId) => {
    const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    // Socket stored as a ref to avoid re-renders and the timing window
    // where state is null even though the socket is already connected
    const socketRef = useRef(null);
    const [targetUser, setTargetUser] = useState(null);
    const [before, setBefore] = useState("");
    const [initialLoad, setInitialLoad] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const user = useSelector(store => store.user);
    const connections = useSelector(store => store.connections);
    const userId = user?._id;
    
    // Refs
    const messagesEndRef = useRef(null);
    const sentinelRef = useRef(null);
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    
    // For manual scroll anchoring
    const prevScrollHeightRef = useRef(0);
    const prevMessagesLenRef = useRef(0);

    const { data: sessionConnections } = useGetConnectionsQuery();
    const { data: chatData, isLoading, isFetching } = useGetChatQuery({ targetUserId, before }, {
        skip: !targetUserId
    });
    
    const [signChatUpload] = useSignChatUploadMutation();

    const chatMessages = chatData?.messages ?? EMPTY_MESSAGES;
    const chatId = chatData?.chatId || null;
    const hasMore = chatData?.hasMore ?? true;

    // Handle Intersection Observer for the Sentinel (top of list)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetching && !isLoading && hasMore && messages.length > 0) {
                    if (chatContainerRef.current) {
                        prevScrollHeightRef.current = chatContainerRef.current.scrollHeight;
                    }
                    setBefore(messages[0]._id);
                }
            },
            { threshold: 0.1 }
        );

        const currentSentinel = sentinelRef.current;
        if (currentSentinel) observer.observe(currentSentinel);

        return () => {
            if (currentSentinel) observer.unobserve(currentSentinel);
        };
    }, [messages, isFetching, isLoading, hasMore]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // Advanced Scroll Anchoring
    React.useLayoutEffect(() => {
        const container = chatContainerRef.current;
        if (!container || messages.length === 0) return;

        const wasPrepend = messages.length > prevMessagesLenRef.current && prevMessagesLenRef.current > 0 && !initialLoad;
        
        if (wasPrepend && prevScrollHeightRef.current > 0) {
            const heightDiff = container.scrollHeight - prevScrollHeightRef.current;
            container.scrollTop += heightDiff;
        } else if (initialLoad) {
            messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
            setInitialLoad(false);
        } else {
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
            if (isNearBottom) {
                scrollToBottom();
            }
        }

        prevMessagesLenRef.current = messages.length;
    }, [messages]);

    const findTargetUser = () => {
        const connectionsArr = sessionConnections?.data || connections;
        if (connectionsArr) {
            const found = connectionsArr.find(c => c._id === targetUserId);
            if (found) return found;
        }
        return null;
    }

    // Reset local state when switching to a different user's chat
    useEffect(() => {
        setMessages([]);
        setBefore("");
        setInitialLoad(true);
        setUploadError("");
        prevMessagesLenRef.current = 0;
        prevScrollHeightRef.current = 0;
        setTargetUser(null);
    }, [targetUserId]);

    // Intelligent sync
    useEffect(() => {
        setMessages(prevLocalMessages => {
            if (chatMessages.length === 0) return prevLocalMessages;
            if (prevLocalMessages.length === 0) return chatMessages;

            const fetchedIds = new Set(chatMessages.map(m => m._id));
            const newlyAddedLocalMessages = prevLocalMessages.filter(m => !fetchedIds.has(m._id));
            
            return [...chatMessages, ...newlyAddedLocalMessages];
        });
    }, [chatMessages]);

    // Handle target user info with fallbacks
    useEffect(() => {
        const locallyFound = findTargetUser();
        if (locallyFound) {
            setTargetUser(locallyFound);
        } else if (chatMessages.length > 0) {
            const opponentMsg = chatMessages.find(m => m.senderId === targetUserId);
            if (opponentMsg) {
                setTargetUser({
                    firstName: opponentMsg.firstName,
                    lastName: opponentMsg.lastName,
                    photoUrl: opponentMsg.photoUrl,
                    _id: targetUserId
                });
            }
        }
    }, [targetUserId, connections, chatMessages, sessionConnections]);

    useEffect(() => {
        if (!uploadError) return;
        const timer = setTimeout(() => {
            setUploadError("");
        }, 3000);
        return () => clearTimeout(timer);
    }, [uploadError]);

    // Socket Connection Setup
    useEffect(() => {
        if (!userId || !targetUserId) return;

        const currentSocket = getSocket();
        if (!currentSocket.connected) currentSocket.connect();
        // Assign to ref immediately – no state update, no extra re-render
        socketRef.current = currentSocket;
        currentSocket.emit("joinChat", { userId, targetUserId });

        const handleMessageReceived = ({ senderId, firstName, lastName, text, messageType, fileUrl, fileName, tempId }) => {
            setMessages((prevMessages) => [...prevMessages, {
                senderId,
                firstName,
                lastName,
                text,
                messageType: messageType || "text",
                fileUrl,
                fileName,
                status: "sent",
                createdAt: new Date()
            }]);
        };

        currentSocket.on("messageReceived", handleMessageReceived);

        return () => {
            // Only remove the room-specific listener; do NOT disconnect the global socket
            // (socket lifecycle is managed globally in Body.jsx via connectSocket/disconnectSocket)
            currentSocket.off("messageReceived", handleMessageReceived);
            socketRef.current = null;
        };
    }, [userId, targetUserId]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadError("");
        if (file.size > MAX_FILE_SIZE_BYTES) {
            setUploadError("Please upload a file smaller than 5 MB.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        let tempId = null;
        let localBlobUrl = null;

        try {
            setIsUploading(true);
            
            localBlobUrl = URL.createObjectURL(file);
            tempId = crypto.randomUUID();
            const isImage = file.type.startsWith("image/");
            const messageType = isImage ? "image" : "file";

            const optimisticMsg = {
                _id: tempId,
                senderId: userId,
                firstName: user.firstName,
                lastName: user.lastName,
                text: "",
                messageType,
                fileUrl: localBlobUrl,
                fileName: file.name,
                status: "pending",
                createdAt: new Date()
            };
            setMessages(prev => [...prev, optimisticMsg]);

            let fileToUpload = file;
            if (isImage) {
                fileToUpload = await imageCompression(file, {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 1200,
                    useWebWorker: true,
                    initialQuality: 0.7
                });
            }

            const { data: signData } = await signChatUpload();
            
            const formData = new FormData();
            formData.append("file", fileToUpload, file.name);
            formData.append("api_key", signData.apiKey);
            formData.append("timestamp", signData.timestamp);
            formData.append("signature", signData.signature);
            formData.append("folder", signData.folder);

            const uploadEndpoint = isImage ? "image/upload" : "raw/upload";
            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${signData.cloudName}/${uploadEndpoint}`,
                { method: "POST", body: formData }
            );
            if (!uploadRes.ok) {
                throw new Error("Failed to upload file to Cloudinary");
            }
            const uploadResult = await uploadRes.json();

            sendMessage(messageType, uploadResult.secure_url, tempId, file.name);

            URL.revokeObjectURL(localBlobUrl);
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            console.error("File upload failed:", err);
            setUploadError("Upload failed. Please try again.");
            if (tempId) {
                setMessages(prev => prev.filter(m => m._id !== tempId));
            }
            if (localBlobUrl) {
                URL.revokeObjectURL(localBlobUrl);
            }
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }

    const sendMessage = (type = "text", fileUrl = null, existingTempId = null, fileName = null) => {
        if (!socketRef.current || (type === "text" && !newMessage.trim())) return;
        if (type === "text") {
            setUploadError("");
        }

        const tempId = existingTempId || crypto.randomUUID();
        const msgText = type === "text" ? newMessage : "";
        
        if (type === "text") {
            const optimisticMsg = {
                _id: tempId,
                senderId: userId,
                firstName: user.firstName,
                lastName: user.lastName,
                text: msgText,
                messageType: type,
                fileUrl: fileUrl,
                fileName,
                status: "pending",
                createdAt: new Date()
            };
            setMessages(prev => [...prev, optimisticMsg]);
            setNewMessage("");
        }

        socketRef.current.emit("sendMessage", {
            firstName: user.firstName,
            lastName: user.lastName,
            userId,
            targetUserId,
            chatId,
            text: msgText,
            messageType: type,
            fileUrl,
            fileName,
            tempId
        }, (ack) => {
            if (ack.status === "ok") {
                setMessages(prev => prev.map(m => 
                    m._id === ack.tempId ? { ...m, _id: ack._id, status: "sent", fileUrl: fileUrl || m.fileUrl, fileName: fileName || m.fileName } : m
                ));
            } else {
                setMessages(prev => prev.map(m => 
                    m._id === ack.tempId ? { ...m, status: "error" } : m
                ));
            }
        });
    }

    return {
        messages,
        newMessage,
        setNewMessage,
        targetUser,
        isFetching,
        isLoading,
        hasMore,
        isUploading,
        uploadError,
        chatContainerRef,
        sentinelRef,
        messagesEndRef,
        fileInputRef,
        handleFileUpload,
        sendMessage,
        scrollToBottom,
        userId,
        user
    };
};
