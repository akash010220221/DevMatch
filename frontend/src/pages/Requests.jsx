import React from 'react';
import { 
    useRequests, 
    RequestsLoadingState, 
    RequestsEmptyState, 
    RequestsHeader, 
    RequestCard, 
    RequestsPagination 
} from '@/features/requests';
import useDocumentTitle from '@/hooks/useDocumentTitle';

const Requests = () => {
    useDocumentTitle("Review Invites");
    const {
        activeTab,
        setActiveTab,
        currentPage,
        setCurrentPage,
        limit,
        isLoading,
        receivedRequests,
        sentRequests,
        currentRequests,
        handleReview,
        handleWithdraw
    } = useRequests();

    if (isLoading) {
        return <RequestsLoadingState />;
    }

    if (currentRequests.length === 0) {
        return (
            <div className='max-w-4xl mx-auto my-10 px-4 sm:px-10 pb-20'>
                <RequestsHeader 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    setCurrentPage={setCurrentPage} 
                    currentRequestsCount={currentRequests.length} 
                    receivedRequestsCount={receivedRequests.length} 
                    sentRequestsCount={sentRequests.length} 
                />
                <RequestsEmptyState activeTab={activeTab} />
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto my-10 px-4 sm:px-10 pb-20'>
            <RequestsHeader 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                setCurrentPage={setCurrentPage} 
                currentRequestsCount={currentRequests.length} 
                receivedRequestsCount={receivedRequests.length} 
                sentRequestsCount={sentRequests.length} 
            />

            <div className='space-y-6'>
                {currentRequests.map((request) => (
                    <RequestCard 
                        key={request._id} 
                        request={request} 
                        activeTab={activeTab} 
                        onReview={handleReview} 
                        onWithdraw={handleWithdraw} 
                    />
                ))}
            </div>

            <RequestsPagination 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
                currentRequestsLength={currentRequests.length} 
                limit={limit} 
            />
        </div>
    );
};

export default Requests;
