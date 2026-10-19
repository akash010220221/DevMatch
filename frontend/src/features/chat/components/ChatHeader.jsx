import React from 'react';
import { Link } from 'react-router-dom';
import { VideoIcon, PhoneIcon, ArrowLeftIcon } from '@/utils/Icons';
import { useVideoCall } from '../context/VideoCallContext';

export const ChatHeader = ({ targetUser }) => {
    const { callUser } = useVideoCall();
    return (
        <div className='px-6 py-4 bg-base-300 border-b border-base-200 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
                <Link to="/connections" className='md:hidden btn btn-ghost btn-circle btn-sm'>
                    <ArrowLeftIcon className="w-5 h-5" />
                </Link>
                <div className="avatar online placeholder hover:scale-105 transition-transform duration-300">
                    <div className="w-12 rounded-2xl bg-base-100 ring-2 ring-base-200 overflow-hidden shadow-md">
                        {targetUser?.photoUrl ? (
                            <img src={targetUser.photoUrl} alt="avatar" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-black uppercase text-xl italic">
                                {targetUser?.firstName?.[0] || "?"}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className='font-black text-lg tracking-tight text-base-content leading-none mb-1 uppercase'>
                        {targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : "Direct Message"}
                    </h2>
                    <div className='flex items-center gap-2'>
                        <span className='w-2 h-2 bg-success rounded-full animate-pulse'></span>
                        <span className='text-[10px] font-black uppercase tracking-widest opacity-40'>Active Professional</span>
                    </div>
                </div>
            </div>

            <div className='flex items-center gap-2'>
                <button
                    onClick={() => callUser(targetUser?._id, `${targetUser?.firstName} ${targetUser?.lastName}`, targetUser?.photoUrl, 'audio')}
                    className='btn btn-ghost btn-circle btn-sm hover:bg-primary/10 hover:text-primary transition-all duration-300 active:scale-90 group'
                >
                    <PhoneIcon className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                </button>
                <button
                    onClick={() => callUser(targetUser?._id, `${targetUser?.firstName} ${targetUser?.lastName}`, targetUser?.photoUrl, 'video')}
                    className='btn btn-ghost btn-circle btn-sm hover:bg-primary/10 hover:text-primary transition-all duration-300 active:scale-90 group'
                >
                    <VideoIcon className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                </button>
            </div>
        </div>
    );
};
