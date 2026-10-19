import React from 'react';

export const RequestCard = React.memo(({ request, activeTab, onReview, onWithdraw }) => {
    const userData = activeTab === 'received' ? request.fromUserId : request.toUserId;
    const { _id, firstName, lastName, age, gender, about, photoUrl, skills } = userData;

    return (
        <div className="group bg-base-300 rounded-[2.5rem] p-6 shadow-xl hover:shadow-secondary/5 transition-all duration-300 border border-base-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 w-full overflow-hidden">
                <div className="shrink-0 relative">
                    <img
                        alt="profile"
                        className="rounded-3xl w-20 h-20 md:w-24 md:h-24 object-cover ring-2 ring-base-200 group-hover:ring-secondary/40 transition-all duration-500"
                        src={photoUrl || "/default-avatar.png"}
                        loading="lazy"
                    />
                    {activeTab === 'received' && (
                        <div className="absolute -top-1 -right-1 badge badge-secondary badge-xs p-1.5 border-4 border-base-300 shadow-lg"></div>
                    )}
                </div>
                <div className="text-left overflow-hidden">
                    <h2 className="font-black text-xl md:text-2xl tracking-tight text-base-content truncate">
                        {firstName} {lastName}
                    </h2>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-40">{gender}</span>
                        {age && <span className="opacity-20 text-[10px]">•</span>}
                        {age && <span className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-40">{age} Years</span>}
                    </div>
                    <p className="text-sm line-clamp-2 opacity-60 leading-relaxed italic mb-3">
                        "{about || "A developer waiting to introduce themselves..."}"
                    </p>
                    {skills && skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {skills.slice(0, 3).map((skill, i) => (
                                <span key={i} className="badge badge-secondary badge-outline badge-sm text-[8px] font-black uppercase tracking-tighter py-2 border-secondary/30">{skill}</span>
                            ))}
                            {skills.length > 3 && <span className="text-[10px] opacity-30 font-black">+{skills.length - 3}</span>}
                        </div>
                    )}
                </div>
            </div>

            <div className='flex gap-3 w-full md:w-auto shrink-0'>
                {activeTab === 'received' ? (
                    <>
                        <button
                            className='btn btn-ghost hover:bg-error/10 hover:text-error rounded-2xl flex-1 md:flex-none h-14 px-8 font-black uppercase text-xs tracking-widest transition-colors'
                            onClick={() => onReview("rejected", request._id)}
                        >
                            Ignore
                        </button>
                        <button
                            className='btn btn-secondary shadow-lg shadow-secondary/20 hover:shadow-secondary/40 rounded-2xl flex-1 md:flex-none h-14 px-8 font-black uppercase text-xs tracking-widest hover:-translate-y-1 active:scale-95 transition-all'
                            onClick={() => onReview("accepted", request._id)}
                        >
                            Accept
                        </button>
                    </>
                ) : (
                    <button
                        className='btn btn-error btn-outline shadow-lg shadow-error/10 hover:shadow-error/30 rounded-2xl w-full md:w-48 h-14 px-8 font-black uppercase text-xs tracking-widest hover:-translate-y-1 active:scale-95 transition-all border-2'
                        onClick={() => onWithdraw(request._id)}
                    >
                        Unsend Request
                    </button>
                )}
            </div>
        </div>
    );
});

RequestCard.displayName = "RequestCard";
