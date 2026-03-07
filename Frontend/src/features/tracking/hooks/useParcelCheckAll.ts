import { useMutation } from '@tanstack/react-query';
import { trackingApi } from '../api/trackingApi';
import type { ParcelRead } from '../../dashboard/types/dashboard.types';

export const useParcelCheckAll = () => {
    return useMutation<ParcelRead[], Error, { student_name: string; phone_number: string }>({
        mutationFn: trackingApi.checkAllParcels,
    });
};
