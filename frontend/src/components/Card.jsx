import React from 'react'
import { useSendConnectionRequestMutation } from '@/utils/apiSlice'

const Card = React.memo(({ user, isPreview = false, onViewProfile }) => {
    const [sendRequest] = useSendConnectionRequestMutation();

    if (!user) return null;

    const handleSendRequest = async (status, userId) => {
        if (isPreview) return; // Guard clause
        try {
            await sendRequest({ status, userId }).unwrap();
        } catch (error) {
            console.error(error.response?.data || error.message)
        }
    }

    return (
        <div className="card bg-base-300 w-full max-w-[380px] h-[600px] shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-base-200 overflow-hidden group">
            {/* Image Section */}
            <figure 
                className={`relative h-2/3 overflow-hidden ${onViewProfile ? 'cursor-pointer' : ''}`}
                onClick={() => onViewProfile && onViewProfile(user)}
            >
                <img
                    src={user?.photoUrl || "/default-avatar.png"}
                    alt={`${user?.firstName}'s profile`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay for Text Clarity */}
                <div className="absolute inset-0 bg-gradient-to-t from-base-300 via-transparent to-transparent opacity-60"></div>

                {/* Floating Badge (Optional) */}
                {user?.gender && (
                    <div className="absolute top-4 right-4 badge badge-primary font-bold shadow-lg py-3 px-4 uppercase text-[10px] tracking-widest">
                        {user.gender}
                    </div>
                )}
            </figure>

            {/* Content Section */}
            <div className="card-body p-6 flex flex-col justify-between">
                <div>
                    <div className="flex flex-col gap-1 mb-3">
                        <div className="flex items-end gap-2 flex-wrap">
                            <h2 
                                className={`card-title text-2xl font-black text-base-content leading-none flex items-center gap-2 ${onViewProfile ? 'hover:text-primary transition-colors cursor-pointer group/name' : ''}`}
                                onClick={() => onViewProfile && onViewProfile(user)}
                            >
                                {user.firstName} {user.lastName}
                                {onViewProfile && (
                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover/name:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-2.5 h-2.5 text-primary">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                                        </svg>
                                    </div>
                                )}
                            </h2>
                            <span className="text-xl opacity-50 font-medium leading-none pb-0.5">{user.age && `• ${user.age}`}</span>
                        </div>
                        {user.headline && (
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 italic mt-1">
                                {user.headline}
                            </p>
                        )}
                    </div>

                    <p className="text-xs opacity-60 line-clamp-3 leading-relaxed mt-1 text-base-content italic px-1 transform hover:opacity-100 transition-opacity">
                        "{user.about || "Architecting tomorrow's code today."}"
                    </p>

                    {/* Skills Badges */}
                    {user?.skills && user?.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4 max-h-[100px] overflow-hidden">
                            {user.skills.slice(0, 5).map((skill, index) => (
                                <div key={index} className="badge badge-accent badge-outline font-extrabold uppercase text-[10px] tracking-wider py-2.5 px-3 border-accent/30 hover:bg-accent/10 transition-colors">
                                    {skill}
                                </div>
                            ))}
                            {user.skills.length > 5 && (
                                <div className="badge badge-ghost font-black text-[10px] uppercase opacity-40">
                                    +{user.skills.length - 5}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="card-actions grid grid-cols-2 gap-4 mt-6">
                    <button
                        className="btn btn-error btn-outline border-2 hover:bg-error hover:text-white transition-all duration-300 font-bold group/btn"
                        onClick={() => handleSendRequest("ignored", user._id)}
                    >
                        <span className="group-hover/btn:scale-110 transition-transform">Pass</span>
                    </button>

                    <button
                        className="btn btn-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 font-bold group/btn"
                        onClick={() => handleSendRequest("interested", user._id)}
                    >
                        <span className="group-hover/btn:scale-110 transition-transform">Connect</span>
                    </button>
                </div>
            </div>
        </div>
    )
})

Card.displayName = "Card"

export default Card