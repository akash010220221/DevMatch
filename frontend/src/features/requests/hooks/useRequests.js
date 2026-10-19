import { useState, useCallback } from 'react';
import { useGetRequestsQuery, useGetSentRequestsQuery, useReviewConnectionRequestMutation, useWithdrawConnectionRequestMutation } from '@/utils/apiSlice';

export const useRequests = () => {
    const [activeTab, setActiveTab] = useState('received');
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 4;

    const { data: receivedData, isLoading: isLoadingReceived } = useGetRequestsQuery({ page: currentPage, limit });
    const { data: sentData, isLoading: isLoadingSent } = useGetSentRequestsQuery({ page: currentPage, limit });
    const [reviewConnectionRequest] = useReviewConnectionRequestMutation();
    const [withdrawConnectionRequest] = useWithdrawConnectionRequestMutation();

    const receivedRequests = receivedData?.data || [];
    const sentRequests = sentData?.data || [];
    
    const isLoading = isLoadingReceived || isLoadingSent;
    const currentRequests = activeTab === 'received' ? receivedRequests : sentRequests;

    const handleReview = useCallback(async (status, requestId) => {
        try {
            await reviewConnectionRequest({ status, requestId }).unwrap();
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    }, [reviewConnectionRequest]);

    const handleWithdraw = useCallback(async (requestId) => {
        try {
            await withdrawConnectionRequest(requestId).unwrap();
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    }, [withdrawConnectionRequest]);

    return {
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
    };
};
