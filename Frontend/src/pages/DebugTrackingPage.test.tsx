import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TrackingPage } from './TrackingPage';
import { useParcelTracking } from '../features/tracking/hooks/useParcelTracking';
import { usePublicStats } from '../features/tracking/hooks/usePublicStats';
import { describe, it, expect, vi, type Mock } from 'vitest';
import React from 'react';

vi.mock('../features/tracking/hooks/useParcelTracking');
vi.mock('../features/tracking/hooks/usePublicStats');
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
        h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
        h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
        span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));
vi.mock('qrcode.react', () => ({
    QRCodeCanvas: () => <div data-testid="qr-code" />,
}));

describe('Debug TrackingPage', () => {
    it('debugs rendering', () => {
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
        screen.debug();
        expect(true).toBe(true);
    });
});
