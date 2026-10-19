import React from 'react';

export const ConnectionsLoadingState = () => {
    return (
        <div className="max-w-6xl mx-auto my-10 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-base-300 w-full h-32 rounded-3xl animate-pulse border border-base-200"></div>
            ))}
        </div>
    );
};
