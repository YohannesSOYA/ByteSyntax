import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const useParcels = () => {
    const queryClient = useQueryClient();

    const fetchQuery = useQuery({
        queryKey: ['parcels'],
        queryFn: dashboardApi.getParcels,
    });

    const collectMutation = useMutation({
        mutationFn: dashboardApi.collectParcel,
        onSuccess: () => {
            // Invalidate data globally so components refetch immediately
            queryClient.invalidateQueries({ queryKey: ['parcels'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        },
    });

    const createMutation = useMutation({
        mutationFn: dashboardApi.createParcel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parcels'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        },
    });

    const uncollectMutation = useMutation({
        mutationFn: dashboardApi.uncollectParcel,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parcels'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        },
    });

    return {
        parcels: fetchQuery.data ?? [],
        isLoading: fetchQuery.isLoading,
        isError: fetchQuery.isError,
        collectParcel: collectMutation.mutate,
        isCollecting: collectMutation.isPending,
        createParcel: createMutation.mutate,
        isCreating: createMutation.isPending,
        uncollectParcel: uncollectMutation.mutate,
        isUncollecting: uncollectMutation.isPending,
    };
};
