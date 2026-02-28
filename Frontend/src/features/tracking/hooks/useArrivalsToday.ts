import { useQuery } from '@tanstack/react-query';
import { trackingApi } from '../api/trackingApi';

export const useArrivalsToday = () => {
    return useQuery({
        queryKey: ['arrivalsToday'],
        queryFn: trackingApi.getArrivalsToday,
        refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    });
};
