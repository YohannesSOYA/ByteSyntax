import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { dashboardApi } from '../api/dashboardApi';

vi.mock('../api/dashboardApi');

describe('useAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('initializes with unauthenticated state if localStorage is empty', () => {
        const { result } = renderHook(() => useAuth());
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('initializes with state from localStorage if available', () => {
        const mockState = { isAuthenticated: true, token: 'stored-token', user: { name: 'admin' } };
        localStorage.setItem('bytesyntax_auth', JSON.stringify(mockState));

        const { result } = renderHook(() => useAuth());
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.token).toBe('stored-token');
    });

    it('login sets state and localStorage on success', async () => {
        const mockResponse = { access_token: 'new-token', token_type: 'bearer' };
        (dashboardApi.login as any).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useAuth());

        let success;
        await act(async () => {
            success = await result.current.login('admin', '1234');
        });

        expect(success).toBe(true);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.token).toBe('new-token');
        expect(localStorage.getItem('bytesyntax_auth')).toContain('new-token');
    });

    it('login returns false and does not set state on failure', async () => {
        (dashboardApi.login as any).mockRejectedValue(new Error('Unauthorized'));

        const { result } = renderHook(() => useAuth());

        let success;
        await act(async () => {
            success = await result.current.login('admin', 'wrong');
        });

        expect(success).toBe(false);
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('logout clears state and localStorage', () => {
        const mockState = { isAuthenticated: true, token: 'stored-token', user: { name: 'admin' } };
        localStorage.setItem('bytesyntax_auth', JSON.stringify(mockState));

        const { result } = renderHook(() => useAuth());

        act(() => {
            result.current.logout();
        });

        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.token).toBeUndefined();
        expect(localStorage.getItem('bytesyntax_auth')).toBeNull();
    });
});
