import { apiClient } from '../../../lib/axios';
import type { ParcelRead } from '../../dashboard/types/dashboard.types';

export interface ParcelPublicLookup {
    student_name: string;
    phone_number: string;
    tracking_suffix: string;
}

export const trackingApi = {
    publicLookup: async (payload: ParcelPublicLookup): Promise<ParcelRead[]> => {
        const { data } = await apiClient.post<ParcelRead[]>('/public/check', payload);
        return data;
    },
};
