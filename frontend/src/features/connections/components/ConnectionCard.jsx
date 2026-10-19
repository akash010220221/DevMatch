import React from 'react';
import { Link } from 'react-router-dom';
import { MessageIcon } from '@/utils/Icons';

export const ConnectionCard = React.memo(({ connection }) => {
    const { _id, firstName, lastName, age, gender, about, photoUrl, skills } = connection;

    return (
        <div className="group bg-base-300 rounded-[2.5rem] p-6 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-base-200 flex flex-col justify-between overflow-hidden relative">
            {/* Decorative background element on hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>

            <div className="flex flex-col items-center text-center gap-5">
                <div className="relative group/photo">
                    <img
                        alt="profile"
                        className="rounded-3xl w-20 h-20 md:w-24 md:h-24 object-cover ring-4 ring-base-100 group-hover:ring-primary/40 transition-all duration-700 shadow-xl"
                        src={photoUrl || "/default-avatar.png"}
                        loading="lazy"
                    />
                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-success border-2 border-base-300 rounded-full shadow-lg"></div>
                </div>

                <div className="w-full">
                    <h2 className="font-black text-xl md:text-2xl tracking-tighter text-base-content truncate">
                        {firstName} {lastName}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-1 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2 py-0.5 bg-base-100 rounded-md border border-base-200">{gender}</span>
                        {age && <span className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2 py-0.5 bg-base-100 rounded-md border border-base-200">{age} Years</span>}
                    </div>
                    <p className="text-xs line-clamp-2 opacity-60 italic px-2 mb-3">
                        "{about || "Saying hello to the world!"}"
                    </p>
                    {/* Skills for connection cards */}
                    {skills && skills.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                            {skills.slice(0, 3).map((skill, i) => (
                                <span key={i} className="badge badge-ghost badge-sm text-[8px] font-black uppercase tracking-tighter py-2 border-base-200">{skill}</span>
                            ))}
                            {skills.length > 3 && <span className="text-[10px] opacity-30 font-black">+{skills.length - 3}</span>}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-center w-full">
                <Link to={"/chat/" + _id} className='w-full'>
                    <button className="btn btn-primary btn-lg w-full rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 lowercase italic font-black text-sm">
                        <MessageIcon className="h-6 w-6" />
                        Let's Chat
                    </button>
                </Link>
            </div>
        </div>
    );
});

ConnectionCard.displayName = "ConnectionCard";
