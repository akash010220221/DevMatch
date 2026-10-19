import React from 'react';

export const RequestsPagination = ({ currentPage, setCurrentPage, currentRequestsLength, limit }) => {
    return (
        <div className="flex justify-center items-center gap-6 mt-16 pb-10">
            <button 
                disabled={currentPage === 1}
                className="btn btn-circle btn-ghost border-2 border-base-content/10 disabled:opacity-20 hover:border-secondary transition-all"
                onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            >
                ❮
            </button>
            
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Page</span>
                <span className="text-xl font-black text-secondary">{currentPage}</span>
            </div>

            <button 
                disabled={currentRequestsLength < limit}
                className="btn btn-circle btn-ghost border-2 border-base-content/10 disabled:opacity-20 hover:border-secondary transition-all"
                onClick={() => {
                    setCurrentPage(p => p + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            >
                ❯
            </button>
        </div>
    );
};
