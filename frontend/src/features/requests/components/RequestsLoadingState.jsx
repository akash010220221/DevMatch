import React from 'react';

export const RequestsLoadingState = () => {
    return (
        <div className="max-w-4xl mx-auto my-10 px-4 space-y-6">
            <div className="flex justify-center gap-4 mb-8">
                <div className="h-12 w-32 bg-base-300 rounded-2xl animate-pulse"></div>
                <div className="h-12 w-32 bg-base-300 rounded-2xl animate-pulse"></div>
            </div>
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-base-300 w-full h-32 rounded-[2.5rem] animate-pulse border border-base-200"></div>
            ))}
        </div>
    );
};
