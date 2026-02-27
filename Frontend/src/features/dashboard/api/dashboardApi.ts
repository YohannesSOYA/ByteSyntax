import { apiClient } from '../../../lib/axios';
import type { DashboardStats, ParcelRead, Token } from '../types/dashboard.types';

export const dashboardApi = {
    login: async (username: string, password: string): Promise<Token> => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const { data } = await apiClient.post<Token>('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return data;
    },

    getStats: async (): Promise<DashboardStats> => {
        const { data } = await apiClient.get<DashboardStats>('/admin/dashboard/stats');
        return data;
    },

    getParcels: async (): Promise<ParcelRead[]> => {
        const { data } = await apiClient.get<ParcelRead[]>('/parcels/');
        return data;
    },

    collectParcel: async (id: number): Promise<ParcelRead> => {
        const { data } = await apiClient.patch<ParcelRead>(`/parcels/${id}/collect`);
        return data;
    },
};
