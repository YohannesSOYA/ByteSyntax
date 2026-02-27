import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useParcelTracking } from './useParcelTracking';
import { trackingApi } from '../api/trackingApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('../api/trackingApi');

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            mutations: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useParcelTracking', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('successfully calls publicLookup mutation', async () => {
        const mockResults = [{ id: 1, student_name: 'John' }];
        (trackingApi.publicLookup as any).mockResolvedValue(mockResults);

        const { result } = renderHook(() => useParcelTracking(), { wrapper: createWrapper() });

        const payload = {
            student_name: 'John',
            phone_number: '1234',
            tracking_suffix: '5678',
        };

        await act(async () => {
            result.current.mutate(payload);
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
            expect(result.current.data).toEqual(mockResults);
            expect(trackingApi.publicLookup).toHaveBeenCalledWith(payload, expect.any(Object));
        });
    });

    it('handles mutation error', async () => {
        (trackingApi.publicLookup as any).mockRejectedValue(new Error('Network Error'));

        const { result } = renderHook(() => useParcelTracking(), { wrapper: createWrapper() });

        await act(async () => {
            result.current.mutate({ student_name: 'x', phone_number: 'y', tracking_suffix: 'z' });
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
            expect(result.current.error?.message).toBe('Network Error');
        });
    });
});
