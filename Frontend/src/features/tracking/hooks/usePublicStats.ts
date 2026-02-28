import { useQuery } from '@tanstack/react-query';
import { trackingApi } from '../api/trackingApi';

export const usePublicStats = () => {
    return useQuery({
        queryKey: ['publicStats'],
        queryFn: trackingApi.getPublicStats,
        refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    });
};
