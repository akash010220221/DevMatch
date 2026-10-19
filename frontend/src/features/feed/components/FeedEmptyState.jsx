import React from 'react';

export const FeedEmptyState = ({ onRefetch }) => {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] px-4 text-center group'>
        <div className="mb-8 p-10 rounded-full bg-base-300 transform transition-transform group-hover:scale-110 duration-500 shadow-xl border border-base-200">
          <span className="text-7xl" role="img" aria-label="Coffee cup icon">☕</span>
        </div>
        <h2 className='text-3xl md:text-5xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary'>
          That's a wrap!
        </h2>
        <p className='text-lg md:text-xl opacity-60 max-w-sm leading-relaxed'>
          You've seen everyone around you for now. Take a break, grab a coffee, and check back later for new developers!
        </p>
        <button
          onClick={onRefetch}
          className="btn btn-primary btn-outline btn-lg mt-10 rounded-full border-2 hover:scale-105 transition-all shadow-xl px-12"
        >
          Refresh Feed
        </button>
      </div>
    );
};
