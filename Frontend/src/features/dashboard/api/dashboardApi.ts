import { apiClient } from '../../../lib/axios';
import type { DashboardStats, ParcelRead, Token, AdminRead, AdminUpdate } from '../types/dashboard.types';

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

    createParcel: async (parcel: any): Promise<ParcelRead> => {
        const { data } = await apiClient.post<ParcelRead>('/parcels/', parcel);
        return data;
    },

    updateProfile: async (adminIn: AdminUpdate): Promise<AdminRead> => {
        const { data } = await apiClient.patch<AdminRead>('/admin/profile', adminIn);
        return data;
    },

    getProfile: async (): Promise<AdminRead> => {
        const { data } = await apiClient.get<AdminRead>('/admin/profile');
        return data;
    },

    uncollectParcel: async (id: number): Promise<ParcelRead> => {
        const { data } = await apiClient.patch<ParcelRead>(`/parcels/${id}/uncollect`);
        return data;
    },

    forgotPassword: async (email: string): Promise<{ message: string }> => {
        const { data } = await apiClient.post('/auth/forgot-password', { email });
        return data;
    },

    resetPassword: async (token: string, new_password: string): Promise<{ message: string }> => {
        const { data } = await apiClient.post('/auth/reset-password', { token, new_password });
        return data;
    },
};
