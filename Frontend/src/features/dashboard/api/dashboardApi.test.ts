import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dashboardApi } from './dashboardApi';
import { apiClient } from '../../../lib/axios';

vi.mock('../../../lib/axios', () => ({
    apiClient: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
    },
}));

describe('dashboardApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('login sends correct credentials and returns token', async () => {
        const mockToken = { access_token: 'test-token', token_type: 'bearer' };
        (apiClient.post as any).mockResolvedValue({ data: mockToken });

        const result = await dashboardApi.login('user', 'pass');

        expect(apiClient.post).toHaveBeenCalledWith(
            '/auth/login',
            expect.any(URLSearchParams),
            expect.objectContaining({
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            })
        );
        expect(result).toEqual(mockToken);
    });

    it('getStats returns dashboard statistics', async () => {
        const mockStats = { total_parcels: 10, pending_collection: 5, collected_today: 2 };
        (apiClient.get as any).mockResolvedValue({ data: mockStats });

        const result = await dashboardApi.getStats();

        expect(apiClient.get).toHaveBeenCalledWith('/admin/dashboard/stats');
        expect(result).toEqual(mockStats);
    });

    it('getParcels returns list of parcels', async () => {
        const mockParcels = [{ id: 1, student_name: 'John' }];
        (apiClient.get as any).mockResolvedValue({ data: mockParcels });

        const result = await dashboardApi.getParcels();

        expect(apiClient.get).toHaveBeenCalledWith('/parcels/');
        expect(result).toEqual(mockParcels);
    });

    it('collectParcel patches the correct endpoint', async () => {
        const mockParcel = { id: 1, status: 'Collected' };
        (apiClient.patch as any).mockResolvedValue({ data: mockParcel });

        const result = await dashboardApi.collectParcel(1);

        expect(apiClient.patch).toHaveBeenCalledWith('/parcels/1/collect');
        expect(result).toEqual(mockParcel);
    });
});
