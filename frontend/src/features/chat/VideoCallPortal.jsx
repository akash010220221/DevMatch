import React, { useEffect, useRef } from 'react';
import { useVideoCall } from './context/VideoCallContext';
import { PhoneIcon, PhoneXIcon, VideoIcon, VideoOffIcon, MicrophoneIcon, MicrophoneOffIcon } from '@/utils/Icons';

const VideoCallPortal = () => {
    const {
        callStatus,
        callType,
        callerData,
        answerCall,
        rejectCall,
        leaveCall,
        stream,
        remoteStream,
        isMuted,
        isVideoOff,
        toggleAudio,
        toggleVideo
    } = useVideoCall();

    const localVideoRef = useRef();
    const remoteVideoRef = useRef();

    // Attach local stream to video element
    useEffect(() => {
        if (stream && localVideoRef.current && callType === 'video') {
            localVideoRef.current.srcObject = stream;
        }
    }, [stream, callType]);

    // Attach remote stream to video element
    useEffect(() => {
        if (remoteStream && remoteVideoRef.current && callType === 'video') {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream, callType]);

    if (callStatus === 'idle') return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300">
            {/* ── Incoming Call ── */}
            {callStatus === 'incoming' && (
                <div className="w-80 p-8 rounded-3xl bg-base-300 shadow-2xl border border-white/10 text-center animate-bounce-subtle">
                    <div className="avatar mb-6">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden shadow-2xl">
                            <img src={callerData?.photo || "/default-avatar.png"} alt="caller" />
                        </div>
                    </div>
                    <h2 className="text-xl font-black text-white mb-1 uppercase tracking-tight">{callerData?.name}</h2>
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        Incoming {callType === 'audio' ? 'Audio' : 'Video'} Call...
                    </p>
                    <div className="flex justify-center gap-6">
                        <button
                            onClick={rejectCall}
                            className="btn btn-circle btn-lg bg-error hover:bg-error/80 border-none shadow-xl hover:scale-110 transition-all active:scale-95"
                        >
                            <PhoneXIcon className="w-6 h-6 text-white" />
                        </button>
                        <button
                            onClick={answerCall}
                            className="btn btn-circle btn-lg bg-success hover:bg-success/80 border-none shadow-xl hover:scale-110 transition-all active:scale-95 animate-pulse"
                        >
                            <PhoneIcon className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>
            )}

            {/* ── Outgoing / Dialing ── */}
            {callStatus === 'calling' && (
                <div className="w-80 p-8 rounded-3xl bg-base-300 shadow-2xl border border-white/10 text-center">
                    <div className="avatar mb-6 animate-pulse">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden shadow-2xl">
                            <img src={callerData?.photo || "/default-avatar.png"} alt="recipient" />
                        </div>
                    </div>
                    <h2 className="text-xl font-black text-white mb-1 uppercase tracking-tight">{callerData?.name}</h2>
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        Calling ({callType === 'audio' ? 'Audio' : 'Video'})...
                    </p>
                    <button
                        onClick={leaveCall}
                        className="btn btn-circle btn-lg bg-error hover:bg-error/80 border-none shadow-xl hover:scale-110 transition-all active:scale-95"
                    >
                        <PhoneXIcon className="w-6 h-6 text-white" />
                    </button>
                </div>
            )}

            {/* ── Active Call ── */}
            {callStatus === 'active' && (
                <div className="relative w-full h-full flex flex-col md:p-8">
                    <div className="relative flex-1 bg-neutral rounded-none md:rounded-[3rem] overflow-hidden shadow-inner border border-white/5 bg-gradient-to-br from-base-300 to-black flex items-center justify-center">
                        {/* Remote Content */}
                        {callType === 'video' ? (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-48 h-48 rounded-full border-4 border-primary/20 p-2 animate-pulse">
                                    <img src={callerData?.photo || "/default-avatar.png"} className="w-full h-full rounded-full object-cover ring-4 ring-primary shadow-2xl" alt="remote" />
                                </div>
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">{callerData?.name}</h2>
                                    <p className="text-primary text-xs font-black uppercase tracking-[0.4em] mt-2">Active Voice Session</p>
                                </div>
                            </div>
                        )}

                        {!remoteStream && callType === 'video' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-40">
                                <div className="loading loading-infinity loading-lg text-primary"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white">Connecting Peer...</p>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
                            <button
                                onClick={toggleAudio}
                                className={`btn btn-circle btn-md border-none ${isMuted ? 'bg-error text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                {isMuted ? <MicrophoneOffIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
                            </button>

                            {callType === 'video' && (
                                <button
                                    onClick={toggleVideo}
                                    className={`btn btn-circle btn-md border-none ${isVideoOff ? 'bg-error text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                >
                                    {isVideoOff ? <VideoOffIcon className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
                                </button>
                            )}

                            <button
                                onClick={leaveCall}
                                className="btn btn-circle btn-lg bg-error hover:bg-error/80 border-none shadow-xl hover:scale-105 transition-all mx-2"
                            >
                                <PhoneXIcon className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Local Video (PIP) - Only for video calls */}
                        {callType === 'video' && (
                            <div className="absolute top-10 right-10 w-32 md:w-60 aspect-video rounded-2xl md:rounded-3xl overflow-hidden bg-base-300 shadow-2xl border-2 border-white/10 ring-4 ring-black/50 ring-offset-0">
                                <video
                                    ref={localVideoRef}
                                    muted
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover mirror"
                                />
                            </div>
                        )}

                        {/* Info Overlay */}
                        <div className="absolute top-10 left-10 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
                            <h3 className="text-xs font-black text-white uppercase tracking-tight mb-0.5">{callerData?.name}</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                                <p className="text-[10px] font-bold text-success uppercase tracking-widest">Connected</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoCallPortal;
