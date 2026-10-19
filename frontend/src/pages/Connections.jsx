import React from 'react';
import { useConnections, ConnectionCard, ConnectionsLoadingState, ConnectionsEmptyState } from '@/features/connections';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const Connections = () => {
    useDocumentTitle("My Network");
    const { connections, isLoading, refetch } = useConnections();

    if (isLoading) {
        return <ConnectionsLoadingState />;
    }

    if (!connections || connections.length === 0) {
        return <ConnectionsEmptyState />;
    }

    return (
        <div className='max-w-7xl mx-auto my-10 px-6 sm:px-10 pb-20'>
            {/* Page Header with Stats */}
            <div className='mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-base-200 pb-8'>
                <div className="text-center md:text-left">
                    <h1 className='text-4xl md:text-6xl font-black tracking-tighter text-base-content uppercase leading-none'>Your Network</h1>
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                        <div className="px-4 py-1.5 bg-primary/10 rounded-full text-primary text-[10px] md:text-xs font-black uppercase tracking-widest border border-primary/20">
                            Professional Connections
                        </div>
                        <span className="text-xl md:text-2xl font-black text-primary">{connections.length}</span>
                    </div>
                </div>
            </div>

            {/* Grid display with 3 columns on large screens to fill empty space */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8'>
                {connections.map((connection) => (
                    <ConnectionCard key={connection._id} connection={connection} />
                ))}
            </div>

            {/* Decorative bottom decoration to fill vertical whitespace */}
            {connections.length > 0 && (
                <div className="mt-20 pt-10 border-t border-base-200 flex justify-center opacity-10">
                    <span className="text-xs font-black uppercase tracking-[1em]">devMatch Network</span>
                </div>
            )}
        </div>
    )
}

export default Connections;
