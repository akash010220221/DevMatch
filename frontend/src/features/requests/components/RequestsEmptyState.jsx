import React from 'react';
import { Link } from 'react-router-dom';

export const RequestsEmptyState = ({ activeTab }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4 bg-base-300/30 rounded-[3rem] border border-dashed border-base-content/10">
            <div className="w-20 h-20 rounded-full bg-base-300 flex items-center justify-center mb-6 shadow-xl border border-base-200">
                <span className="text-4xl" role="img" aria-label="Inbox icon">
                    {activeTab === 'received' ? '📥' : '📤'}
                </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-base-content mb-3">
                {activeTab === 'received' ? 'Inbox Clean!' : 'No Sent Requests'}
            </h2>
            <p className="opacity-60 max-w-sm mx-auto text-sm font-medium">
                {activeTab === 'received' 
                    ? "No pending connection requests at the moment. You're all caught up!" 
                    : "You haven't sent any invitations yet. Start exploring the network!"}
            </p>
            <Link to="/feed" className="btn btn-secondary btn-outline btn-md mt-8 rounded-full px-10 border-2 hover:scale-105 transition-all font-black uppercase text-xs tracking-widest">
                Explore Developers
            </Link>
        </div>
    );
};
