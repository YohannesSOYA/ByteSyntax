import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LoginForm } from '../features/dashboard/components/LoginForm';
import { DashboardPage } from './DashboardPage';
import { useAuth } from '../features/dashboard/hooks/useAuth';
import { useDashboardStats } from '../features/dashboard/hooks/useDashboardStats';
import { useParcels } from '../features/dashboard/hooks/useParcels';

// Mocks
vi.mock('../features/dashboard/hooks/useAuth');
vi.mock('../features/dashboard/hooks/useDashboardStats');
vi.mock('../features/dashboard/hooks/useParcels');

// Mock Layout and components to focus on flow
vi.mock('../components/common/Layout', () => ({
    Layout: ({ children }: any) => <div data-testid="layout">{children}</div>
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
        h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Administrative Dashboard Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('redirects from Dashboard to Login if unauthenticated', () => {
        (useAuth as Mock).mockReturnValue({
            isAuthenticated: false,
            user: null
        });

        render(
            <MemoryRouter initialEntries={['/admin/dashboard']}>
                <Routes>
                    <Route path="/admin" element={<div>Login Page</div>} />
                    <Route path="/admin/dashboard" element={<DashboardPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('renders dashboard content when authenticated', () => {
        (useAuth as Mock).mockReturnValue({
            isAuthenticated: true,
            user: { name: 'Admin User' }
        });
        (useDashboardStats as Mock).mockReturnValue({ data: null, isLoading: false });
        (useParcels as Mock).mockReturnValue({ parcels: [], isLoading: false });

        render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/Good/i)).toBeInTheDocument();
        expect(screen.getByText('Admin User')).toBeInTheDocument();
        expect(screen.getByText(/Registry/i)).toBeInTheDocument();
    });

    it('handles successful login and navigation', async () => {
        const mockLogin = vi.fn().mockResolvedValue(true);
        const mockNavigate = vi.fn();

        // Mocking useNavigate within the test component is tricky, 
        // but LoginForm uses it. We rely on MemoryRouter to catch the change.

        (useAuth as Mock).mockReturnValue({
            login: mockLogin
        });

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/admin" element={<LoginForm />} />
                    <Route path="/admin/dashboard" element={<div>Dashboard</div>} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
        fireEvent.change(screen.getByLabelText(/PIN/i), { target: { value: '1234' } });

        fireEvent.click(screen.getByRole('button', { name: /Authenticate/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('admin', '1234');
            expect(screen.getByText('Dashboard')).toBeInTheDocument();
        });
    });

    it('shows error on failed login', async () => {
        const mockLogin = vi.fn().mockResolvedValue(false);
        (useAuth as Mock).mockReturnValue({
            login: mockLogin
        });

        render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'admin' } });
        fireEvent.change(screen.getByLabelText(/PIN/i), { target: { value: '9999' } });

        fireEvent.click(screen.getByRole('button', { name: /Authenticate/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('admin', '9999');
            expect(screen.getByText(/Authentication failed/i)).toBeInTheDocument();
        });
    });
});
