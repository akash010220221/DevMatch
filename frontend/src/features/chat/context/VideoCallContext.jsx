import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import Peer from 'simple-peer-light';
import { useSelector } from 'react-redux';
import { getSocket } from '@/utils/socket';
import { toast } from 'react-hot-toast';
import getIceServers from '@/utils/iceServers';

const VideoCallContext = createContext(null);

const noopFn = () => { };
const defaultValue = {
    callStatus: 'idle', callerData: null, stream: null, remoteStream: null,
    isMuted: false, isVideoOff: false,
    callUser: noopFn, answerCall: noopFn, rejectCall: noopFn, leaveCall: noopFn,
    toggleAudio: noopFn, toggleVideo: noopFn
};

export const useVideoCall = () => useContext(VideoCallContext) || defaultValue;

export const VideoCallProvider = ({ children }) => {
    const user = useSelector(store => store.user);
    const userId = user?._id;

    const [stream, setStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [callStatus, setCallStatus] = useState('idle');
    const [callType, setCallType] = useState('video'); // 'video' or 'audio'
    const [callerData, setCallerData] = useState(null);
    const [peerSignal, setPeerSignal] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const connectionRef = useRef(null);
    const streamRef = useRef(null);
    const callStatusRef = useRef('idle');
    const callTypeRef = useRef('video');
    const callerDataRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => { callStatusRef.current = callStatus; }, [callStatus]);
    useEffect(() => { callTypeRef.current = callType; }, [callType]);
    useEffect(() => { callerDataRef.current = callerData; }, [callerData]);

    const getMedia = async (withVideo = true) => {
        try {
            console.log(`[VIDEO_CALL] Requesting media (video: ${withVideo})`);
            const constraints = {
                video: withVideo ? { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } : false,
                audio: true
            };
            const currentStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(currentStream);
            streamRef.current = currentStream;
            return currentStream;
        } catch (err) {
            console.error('[VIDEO_CALL] Media Access Error:', err);
            toast.error('Could not access camera/microphone');
            return null;
        }
    };

    const cleanupCall = useCallback((notifyOther = false) => {
        console.log('[VIDEO_CALL] Cleaning up call. Notify remote:', notifyOther);

        if (notifyOther && callerDataRef.current?.id) {
            getSocket()?.emit('endCall', { to: callerDataRef.current.id });
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (connectionRef.current) {
            try { connectionRef.current.destroy(); } catch (e) { }
            connectionRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        setStream(null);
        setRemoteStream(null);
        setCallStatus('idle');
        setCallerData(null);
        setPeerSignal(null);
        setIsMuted(false);
        setIsVideoOff(false);
    }, []);

    // ── Socket event listeners ──
    useEffect(() => {
        if (!userId) return;

        let socketInstance = null;

        const onIncomingCall = (data) => {
            console.log('[VIDEO_CALL] Incoming call from:', data.name, 'Type:', data.type);
            const { from, signal, name, photo, type } = data;

            if (callStatusRef.current !== 'idle') {
                getSocket()?.emit('rejectCall', { to: from });
                return;
            }
            const incomingType = type || 'video';
            setCallType(incomingType);
            callTypeRef.current = incomingType;
            setCallStatus('incoming');
            setCallerData({ id: from, name, photo });
            setPeerSignal(signal);
        };

        const onCallAccepted = (signal) => {
            console.log('[VIDEO_CALL] Call accepted (Offer → Answer sequence completing)');
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            setCallStatus('active');
            if (connectionRef.current) {
                connectionRef.current.signal(signal);
            }
        };

        const onCallRejected = () => {
            console.log('[VIDEO_CALL] Remote peer declined');
            toast.error('Call declined');
            cleanupCall();
        };

        const onCallEnded = () => {
            console.log('[VIDEO_CALL] Remote peer disconnected');
            toast('Session ended', { icon: '📞' });
            cleanupCall();
        };

        const socket = getSocket();
        if (socket) {
            socketInstance = socket;
            socket.on('incomingCall', onIncomingCall);
            socket.on('callAccepted', onCallAccepted);
            socket.on('callRejected', onCallRejected);
            socket.on('callEnded', onCallEnded);
        }

        return () => {
            if (socketInstance) {
                socketInstance.off('incomingCall', onIncomingCall);
                socketInstance.off('callAccepted', onCallAccepted);
                socketInstance.off('callRejected', onCallRejected);
                socketInstance.off('callEnded', onCallEnded);
            }
        };
    }, [userId, cleanupCall]);

    const callUser = async (targetUserId, targetName, targetPhoto, type = 'video') => {
        if (!targetUserId) return;

        const localStream = await getMedia(type === 'video');
        if (!localStream) return;

        console.log('[VIDEO_CALL] Initiating call to:', targetName, 'Mode:', type);
        setCallType(type);
        setCallStatus('calling');
        setCallerData({ id: targetUserId, name: targetName, photo: targetPhoto });

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: localStream,
            config: {
                iceServers: getIceServers()
            }
        });

        connectionRef.current = peer;

        peer.on('signal', (data) => {
            console.log('[VIDEO_CALL] Sending Signal (Offer)');
            const socket = getSocket();
            socket.emit('callUser', {
                userToCall: targetUserId,
                signalData: data,
                from: userId,
                name: `${user.firstName} ${user.lastName}`,
                photo: user.photoUrl,
                type: type
            });
        });

        timeoutRef.current = setTimeout(() => {
            if (callStatusRef.current === 'calling') {
                toast.error('No response');
                leaveCall();
            }
        }, 20000);

        peer.on('stream', (remoteMediaStream) => {
            console.log('[VIDEO_CALL] Remote stream received');
            setRemoteStream(remoteMediaStream);
        });

        peer.on('error', (err) => {
            console.error('[VIDEO_CALL] Connection Error (Initiator):', err);
            toast.error('Connection failed');
            cleanupCall(true); // Notify other side that we crashed
        });
    };

    const answerCall = async () => {
        const mode = callTypeRef.current === 'video';
        const localStream = await getMedia(mode);
        if (!localStream) {
            rejectCall();
            return;
        }

        console.log('[VIDEO_CALL] Answering call. Stream mode:', mode ? 'Video' : 'Audio');
        setCallStatus('active');

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: localStream,
            config: {
                iceServers: getIceServers()
            }
        });

        connectionRef.current = peer;

        peer.on('signal', (data) => {
            console.log('[VIDEO_CALL] Sending Signal (Answer)');
            const socket = getSocket();
            socket.emit('answerCall', { to: callerDataRef.current?.id, signal: data });
        });

        peer.on('stream', (remoteMediaStream) => {
            console.log('[VIDEO_CALL] Remote stream received (Answerer)');
            setRemoteStream(remoteMediaStream);
        });

        peer.on('error', (err) => {
            console.error('[VIDEO_CALL] Connection Error (Answerer):', err);
            toast.error('Connection failed');
            cleanupCall(true);
        });

        try {
            peer.signal(peerSignal);
        } catch (e) {
            console.error('[VIDEO_CALL] Peer Signal processing error:', e);
            cleanupCall(true);
        }
    };

    const rejectCall = () => {
        const socket = getSocket();
        if (callerDataRef.current?.id) {
            socket.emit('rejectCall', { to: callerDataRef.current.id });
        }
        cleanupCall();
    };

    const leaveCall = () => {
        const socket = getSocket();
        if (callerDataRef.current?.id) {
            socket.emit('endCall', { to: callerDataRef.current.id });
        }
        cleanupCall();
    };

    const toggleAudio = () => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOff(!videoTrack.enabled);
            }
        }
    };

    const value = {
        callStatus, callType, callerData, stream, remoteStream,
        isMuted, isVideoOff,
        callUser, answerCall, rejectCall, leaveCall,
        toggleAudio, toggleVideo
    };

    return (
        <VideoCallContext.Provider value={value}>
            {children}
        </VideoCallContext.Provider>
    );
};
