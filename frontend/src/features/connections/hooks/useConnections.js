import { useGetConnectionsQuery } from '@/utils/apiSlice';

export const useConnections = () => {
    const { data, isLoading } = useGetConnectionsQuery();
    const connections = data?.data;

    return {
        connections,
        isLoading
    };
};
