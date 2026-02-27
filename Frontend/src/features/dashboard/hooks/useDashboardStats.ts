import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboardStats'],
        queryFn: dashboardApi.getStats,
        refetchInterval: 1000 * 60, // Poll every minute for fresh stats
    });
};
