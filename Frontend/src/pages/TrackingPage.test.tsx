import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TrackingPage } from './TrackingPage';
import { useParcelTracking } from '../features/tracking/hooks/useParcelTracking';
import { describe, it, expect, vi, type Mock } from 'vitest';
import React from 'react';

// Mock the hook
vi.mock('../features/tracking/hooks/useParcelTracking');

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

// Mock qrcode.react
vi.mock('qrcode.react', () => ({
    QRCodeCanvas: () => <div data-testid="qr-code" />,
}));

describe('TrackingPage', () => {
    it('renders the search form', () => {
        (useParcelTracking as Mock).mockReturnValue({
            mutate: vi.fn(),
            isPending: false
        });

        render(<TrackingPage />);

        expect(screen.getByText(/byte/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Recipient Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Last 4 chars/i)).toBeInTheDocument();
    });

    it('displays results when search is successful', async () => {
        const mockMutate = vi.fn((params, options) => {
            options.onSuccess([
                {
                    id: 1,
                    student_name: 'John Doe',
                    tracking_number: 'ABC12345678',
                    status: 'Pending',
                    arrived_at: '2026-02-27T10:00:00Z',
                    notes: 'Shelf A'
                }
            ]);
        });

        (useParcelTracking as Mock).mockReturnValue({
            mutate: mockMutate,
            isPending: false
        });

        render(<TrackingPage />);

        // Fill form
        fireEvent.change(screen.getByLabelText(/Recipient Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '0123456789' } });
        fireEvent.change(screen.getByLabelText(/Tracking Suffix/i), { target: { value: '5678' } });

        // Click search
        fireEvent.click(screen.getByText(/Initialize Retrieval/i));

        // Wait for results
        await waitFor(() => {
            expect(screen.getByText(/Consignment Ready/i)).toBeInTheDocument();
            expect(screen.getByText(/LOC: Shelf A/i)).toBeInTheDocument();
        });
    });

    it('displays error message when no parcel is found', async () => {
        const mockMutate = vi.fn((params, options) => {
            options.onSuccess([]);
        });

        (useParcelTracking as Mock).mockReturnValue({
            mutate: mockMutate,
            isPending: false
        });

        render(<TrackingPage />);

        fireEvent.change(screen.getByLabelText(/Recipient Name/i), { target: { value: 'Jane Doe' } });
        fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '0987654321' } });
        fireEvent.change(screen.getByLabelText(/Tracking Suffix/i), { target: { value: '0000' } });

        fireEvent.click(screen.getByText(/Initialize Retrieval/i));

        await waitFor(() => {
            expect(screen.getByText(/Identifier Mismatch/i)).toBeInTheDocument();
        });
    });
});
