import { apiClient } from '../../../lib/axios';
import type { ParcelRead } from '../../dashboard/types/dashboard.types';

export interface ParcelPublicLookup {
    student_name: string;
    phone_number: string;
    tracking_suffix: string;
}

export interface PublicStats {
    arrived_today: number;
    pending_total: number;
}

export const trackingApi = {
    publicLookup: async (payload: ParcelPublicLookup): Promise<ParcelRead[]> => {
        const { data } = await apiClient.post<ParcelRead[]>('/public/check', payload);
        return data;
    },

    getPublicStats: async (): Promise<PublicStats> => {
        const { data } = await apiClient.get<PublicStats>('/public/stats');
        return data;
    },

    getArrivalsToday: async (): Promise<ParcelRead[]> => {
        const { data } = await apiClient.get<ParcelRead[]>('/public/arrivals-today');
        return data;
    },
};
