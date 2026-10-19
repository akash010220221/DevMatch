import React from 'react';

export const FeedLoadingState = () => {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fadeIn'>
        <div className="card bg-base-300 w-full max-w-[380px] h-[600px] shadow-sm animate-pulse rounded-2xl flex flex-col overflow-hidden border border-base-200">
          <div className="bg-base-200 h-2/3 w-full"></div>
          <div className="p-10 space-y-6">
            <div className="h-8 bg-base-200 rounded-full w-3/4"></div>
            <div className="h-4 bg-base-200 rounded-full w-1/2"></div>
            <div className="space-y-4 pt-8">
              <div className="h-14 bg-base-200 rounded-xl"></div>
              <div className="h-14 bg-base-200 rounded-xl"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 opacity-40">
          <span className="loading loading-spinner loading-md"></span>
          <p className="font-bold tracking-widest uppercase text-xs">Curating Your Feed</p>
        </div>
      </div>
    );
};
