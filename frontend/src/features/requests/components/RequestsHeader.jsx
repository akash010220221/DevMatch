import React from 'react';

export const RequestsHeader = ({ activeTab, setActiveTab, setCurrentPage, currentRequestsCount, receivedRequestsCount, sentRequestsCount }) => {
    return (
        <div className='mb-12'>
            <div className='flex flex-col lg:flex-row justify-between items-center lg:items-end gap-8 mb-10'>
                <div className='text-center lg:text-left'>
                    <h1 className='text-3xl md:text-4xl font-black tracking-tighter text-base-content uppercase'>
                        {activeTab === 'received' ? 'Incoming Requests' : 'Withdraw Requests'}
                    </h1>
                    <div className="h-1.5 w-24 bg-secondary rounded-full mt-3 mx-auto lg:mx-0"></div>
                    <p className="text-sm opacity-50 font-bold uppercase tracking-[0.2em] mt-4">
                        {currentRequestsCount} {activeTab === 'received' ? 'Potential Collaborators' : 'Pending Approvals'}
                    </p>
                </div>

                <div className="tabs tabs-box bg-base-300 p-1.5 rounded-[2rem] border border-base-200 shadow-inner">
                    <button 
                        className={`tab h-12 px-8 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'received' ? 'tab-active bg-secondary text-secondary-content shadow-lg' : 'opacity-50 hover:opacity-100'}`}
                        onClick={() => { setActiveTab('received'); setCurrentPage(1); }}
                    >
                        Received ({receivedRequestsCount})
                    </button>
                    <button 
                        className={`tab h-12 px-8 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === 'sent' ? 'tab-active bg-secondary text-secondary-content shadow-lg' : 'opacity-50 hover:opacity-100'}`}
                        onClick={() => { setActiveTab('sent'); setCurrentPage(1); }}
                    >
                        Sent ({sentRequestsCount})
                    </button>
                </div>
            </div>
        </div>
    );
};
