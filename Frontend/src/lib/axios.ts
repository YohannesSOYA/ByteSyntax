import axios from 'react';
/* I am creating the file first */
import axiosLib from 'axios';

// Replace the URL depending on deployment/local testing
const BASE_URL = 'http://localhost:8000/api/v1';

export const apiClient = axiosLib.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add JWT token
apiClient.interceptors.request.use(
    (config) => {
        const authDataStr = localStorage.getItem('bytesyntax_auth');
        if (authDataStr) {
            try {
                const authState = JSON.parse(authDataStr);
                if (authState.token) {
                    config.headers.Authorization = `Bearer ${authState.token}`;
                }
            } catch (e) {
                // Ignore parse error
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor for 401s (token expire/invalid)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorised - clear local storage and force login
            localStorage.removeItem('bytesyntax_auth');
            if (window.location.pathname !== '/admin') {
                window.location.href = '/admin';
            }
        }
        return Promise.reject(error);
    }
);
