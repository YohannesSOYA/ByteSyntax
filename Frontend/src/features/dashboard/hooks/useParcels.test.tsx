import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useParcels } from './useParcels';
import { dashboardApi } from '../api/dashboardApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('../api/dashboardApi');

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useParcels', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches parcels on initialization', async () => {
        const mockParcels = [{ id: 1, student_name: 'John' }];
        (dashboardApi.getParcels as any).mockResolvedValue(mockParcels);

        const { result } = renderHook(() => useParcels(), { wrapper: createWrapper() });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.parcels).toEqual(mockParcels);
            expect(result.current.isLoading).toBe(false);
        });
    });

    it('returns empty array on fetch failure', async () => {
        (dashboardApi.getParcels as any).mockRejectedValue(new Error('Fetch failed'));

        const { result } = renderHook(() => useParcels(), { wrapper: createWrapper() });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
            expect(result.current.parcels).toEqual([]);
        });
    });

    it('exposes collectParcel mutation', async () => {
        const mockParcel = { id: 1, status: 'Collected' };
        (dashboardApi.collectParcel as any).mockResolvedValue(mockParcel);

        const { result } = renderHook(() => useParcels(), { wrapper: createWrapper() });

        await act(async () => {
            result.current.collectParcel(1);
        });

        await waitFor(() => {
            expect(dashboardApi.collectParcel).toHaveBeenCalledWith(1, expect.any(Object));
        });
    });
});
