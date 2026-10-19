import { useGetFeedQuery } from '@/utils/apiSlice'

export const useFeed = () => {
  const { data, isLoading, refetch } = useGetFeedQuery();
  const feed = data?.data;

  return {
    feed,
    isLoading,
    refetch,
  };
};
