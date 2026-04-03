import { useState, useCallback } from 'react';
import type { AuthState } from '../types/dashboard.types';
import { dashboardApi } from '../api/dashboardApi';

const AUTH_KEY = 'bytesyntax_auth';

const getInitialState = (): AuthState => {
    try {
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) return JSON.parse(stored);
    } catch {
        // ignore parse errors
    }
    return { isAuthenticated: false };
};

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>(getInitialState);

    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        try {
            const tokenResponse = await dashboardApi.login(username, password);

            const newState: AuthState = {
                isAuthenticated: true,
                token: tokenResponse.access_token,
                user: { name: username },
            };

            localStorage.setItem(AUTH_KEY, JSON.stringify(newState));
            setAuthState(newState);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(AUTH_KEY);
        setAuthState({ isAuthenticated: false });
    }, []);

    return { ...authState, login, logout };
};
