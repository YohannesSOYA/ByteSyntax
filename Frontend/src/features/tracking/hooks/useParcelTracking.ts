import { useMutation } from '@tanstack/react-query';
import { trackingApi, type ParcelPublicLookup } from '../api/trackingApi';
import type { ParcelRead } from '../../dashboard/types/dashboard.types';

export const useParcelTracking = () => {
    return useMutation<ParcelRead[], Error, ParcelPublicLookup>({
        mutationFn: trackingApi.publicLookup,
    });
};
