import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackingApi } from './trackingApi';
import { apiClient } from '../../../lib/axios';

vi.mock('../../../lib/axios', () => ({
    apiClient: {
        post: vi.fn(),
    },
}));

describe('trackingApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('publicLookup sends correct payload and returns results', async () => {
        const mockResults = [{ id: 1, student_name: 'John' }];
        (apiClient.post as any).mockResolvedValue({ data: mockResults });

        const payload = {
            student_name: 'John',
            phone_number: '1234',
            tracking_suffix: '5678',
        };

        const result = await trackingApi.publicLookup(payload);

        expect(apiClient.post).toHaveBeenCalledWith('/public/check', payload);
        expect(result).toEqual(mockResults);
    });
});
