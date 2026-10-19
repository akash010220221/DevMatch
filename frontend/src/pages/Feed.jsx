import React, { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { useFeed, FeedLoadingState, FeedEmptyState } from '@/features/feed';
import ProfileCV from '@/features/profile/components/ProfileCV';
import { useSendConnectionRequestMutation } from '@/utils/apiSlice'

import useDocumentTitle from '@/hooks/useDocumentTitle';

const Feed = () => {
  useDocumentTitle("Discovery");
  const { feed, isLoading, refetch } = useFeed();
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [sendRequest] = useSendConnectionRequestMutation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedProfile(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAction = async (status, userId) => {
      try {
          setSelectedProfile(null); // Close modal right away for optimistic UI feel
          await sendRequest({ status, userId }).unwrap();
      } catch (error) {
          console.error(error);
      }
  };

  if (isLoading) {
    return <FeedLoadingState />;
  }

  if (!feed || feed.length === 0) {
    return <FeedEmptyState onRefetch={() => refetch()} />;
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center my-10 px-4 animate-slideIn'>
        <div className='relative group'>
          <Card user={feed[0]} onViewProfile={(u) => setSelectedProfile(u)} />
          {/* Visual Hint for multiple cards */}
          {feed.length > 1 && (
            <div className="absolute -bottom-4 -z-10 w-[95%] left-1/2 -translate-x-1/2 h-10 bg-base-300 rounded-2xl opacity-40 border border-base-200 shadow-xl transition-transform group-hover:translate-y-2"></div>
          )}
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 opacity-30 text-xs font-black uppercase tracking-[0.2em]">
          <span className="h-px w-8 bg-current"></span>
          <span>{feed.length} dev discoveries remaining</span>
          <span className="h-px w-8 bg-current"></span>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <div 
          className="fixed inset-0 z-50 flex justify-center items-end sm:items-center p-0 sm:p-4 bg-base-300/80 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if(e.target === e.currentTarget) setSelectedProfile(null);
          }}
        >
            {/* Modal Container */}
            <div className="relative w-full max-w-7xl max-h-[90vh] sm:max-h-[95vh] bg-base-100 sm:rounded-[3rem] rounded-t-[3rem] shadow-2xl overflow-hidden border border-base-content/10 animate-slideUp flex flex-col">
                
                {/* Absolute Close Button */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-[100]">
                  <button 
                    onClick={() => setSelectedProfile(null)}
                    className="btn btn-circle btn-sm sm:btn-md btn-ghost bg-base-300/80 backdrop-blur-md hover:bg-error/20 hover:text-error transition-all cursor-pointer border border-white/10 shadow-2xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Content wrapper with proper padding */}
                <div className="pt-2 sm:pt-6 pb-40 px-4 sm:px-6 w-full flex-1 overflow-y-auto">
                  <ProfileCV user={selectedProfile} />
                </div>

                {/* Absolute Quick Action Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 bg-gradient-to-t from-base-100 via-base-100/90 to-transparent flex justify-center gap-6 z-50 pointer-events-none">
                   <div className="pointer-events-auto flex gap-4 p-2 bg-base-300/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-base-300/50">
                      <button
                          className="btn btn-circle btn-lg btn-error btn-outline border-2 hover:bg-error hover:text-white transition-all duration-300 w-16 h-16 sm:w-20 sm:h-20"
                          onClick={() => handleAction("ignored", selectedProfile._id)}
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>

                      <button
                          className="btn btn-circle btn-lg btn-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 w-16 h-16 sm:w-20 sm:h-20"
                          onClick={() => handleAction("interested", selectedProfile._id)}
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </button>
                   </div>
                </div>
            </div>
        </div>
      )}
    </>
  )
}

export default Feed;
