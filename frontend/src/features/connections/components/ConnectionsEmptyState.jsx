import React from 'react';
import { Link } from 'react-router-dom';

export const ConnectionsEmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="p-10 rounded-full bg-base-300 shadow-xl border border-base-200 mb-8 animate-pulse">
                <span className="text-6xl" role="img" aria-label="Shake hands">🤝</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-base-content mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Network is Quiet</h2>
            <p className="opacity-60 max-w-sm mx-auto text-lg leading-relaxed">Your professional circle is waiting to grow! Explore the developer feed to find your next co-builder.</p>
            <Link to="/feed" className="btn btn-primary btn-lg mt-10 rounded-full px-12 shadow-xl shadow-primary/20 hover:scale-105 transition-all">Go to Feed</Link>
        </div>
    );
};
