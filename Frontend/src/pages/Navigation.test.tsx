import { render, screen } from '@testing-library/react';
import { TrackingPage } from './TrackingPage';
import { LoginPage } from './LoginPage';
import { useParcelTracking } from '../features/tracking/hooks/useParcelTracking';
import { usePublicStats } from '../features/tracking/hooks/usePublicStats';
import { useArrivalsToday } from '../features/tracking/hooks/useArrivalsToday';
import { useAuth } from '../features/dashboard/hooks/useAuth';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, type Mock } from 'vitest';
import React from 'react';

// Mock hooks
vi.mock('../features/tracking/hooks/useParcelTracking');
vi.mock('../features/tracking/hooks/usePublicStats');
vi.mock('../features/tracking/hooks/useArrivalsToday');
vi.mock('../features/dashboard/hooks/useAuth');

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => {
    const mockComponent = (Component: string) => {
        return ({ children, whileHover, whileTap, initial, animate, exit, transition, ...props }: any) => {
            const Tag = Component as any;
            return <Tag {...props}>{children}</Tag>;
        };
    };

    return {
        motion: {
            div: mockComponent('div'),
            h1: mockComponent('h1'),
            h2: mockComponent('h2'),
            h3: mockComponent('h3'),
            p: mockComponent('p'),
            span: mockComponent('span'),
            button: mockComponent('button'),
        },
        AnimatePresence: ({ children }: any) => <>{children}</>,
    };
});

// Mock LoginForm to simplify LoginPage test
vi.mock('../features/dashboard/components/LoginForm', () => ({
    LoginForm: () => <div data-testid="login-form">Login Form</div>,
}));

// Mock qrcode.react
vi.mock('qrcode.react', () => ({
    QRCodeCanvas: () => <div data-testid="qr-code" />,
}));

describe('Navigation', () => {
    it('TrackingPage has link to Admin Portal Access', () => {
        (useParcelTracking as Mock).mockReturnValue({
            mutate: vi.fn(),
            isPending: false
        });
        (usePublicStats as Mock).mockReturnValue({
            data: { arrived_today: 5, pending_total: 10 },
            isLoading: false
        });

        render(
            <MemoryRouter>
                <TrackingPage />
            </MemoryRouter>
        );

        const adminLink = screen.getByRole('link', { name: /Admin Portal Access/i });
        expect(adminLink).toHaveAttribute('href', '/admin');
    });

    it('LoginPage has link back to Tracking', () => {
        (useAuth as Mock).mockReturnValue({
            login: vi.fn(),
            logout: vi.fn(),
            isAuthenticated: false
        });
        (useArrivalsToday as Mock).mockReturnValue({
            data: [{ id: 1, tracking_number: 'TEST1234' }],
            isLoading: false
        });

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const backLink = screen.getByRole('link', { name: /Back to Tracking/i });
        expect(backLink).toHaveAttribute('href', '/');
    });
});
