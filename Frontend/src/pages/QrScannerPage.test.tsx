import { render, screen, waitFor, act } from '@testing-library/react';
import { QrScannerPage } from './QrScannerPage';
import { useParcels } from '../features/dashboard/hooks/useParcels';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { describe, it, expect, vi, type Mock, beforeEach } from 'vitest';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// Mocks
vi.mock('../features/dashboard/hooks/useParcels');
vi.mock('html5-qrcode');
vi.mock('../components/common/Layout', () => ({
    Layout: ({ children }: any) => <div>{children}</div>
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children }: any) => <div>{children}</div>,
        h2: ({ children }: any) => <h2>{children}</h2>,
        h3: ({ children }: any) => <h3>{children}</h3>,
        p: ({ children }: any) => <p>{children}</p>,
        span: ({ children }: any) => <span>{children}</span>,
        button: ({ children }: any) => <button>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('QrScannerPage', () => {
    let mockCollectParcel: any;
    let mockScannerRender: any;
    let mockScannerClear: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockCollectParcel = vi.fn();
        (useParcels as Mock).mockReturnValue({
            collectParcel: mockCollectParcel,
            isCollecting: false
        });

        mockScannerRender = vi.fn();
        mockScannerClear = vi.fn().mockResolvedValue(undefined);
        (Html5QrcodeScanner as any).mockImplementation(function (this: any) {
            this.render = mockScannerRender;
            this.clear = mockScannerClear;
            return this;
        });
    });

    it('renders the scanner interface', () => {
        render(
            <MemoryRouter>
                <QrScannerPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/parcel/i)).toBeInTheDocument();
        expect(screen.getByText(/scanner/i)).toBeInTheDocument();
        expect(mockScannerRender).toHaveBeenCalled();
    });

    it('handles successful QR scan', async () => {
        render(
            <MemoryRouter>
                <QrScannerPage />
            </MemoryRouter>
        );

        // Simulate onScanSuccess callback from the scanner
        const onScanSuccess = mockScannerRender.mock.calls[0][0];

        // Mock successful collection mutation
        mockCollectParcel.mockImplementation((id: number, options: any) => {
            options.onSuccess();
        });

        await act(async () => {
            onScanSuccess('bs-parcel:42');
        });

        await waitFor(() => {
            expect(screen.getByText(/Collection Confirmed/i)).toBeInTheDocument();
            expect(screen.getByText(/ID: 42/i)).toBeInTheDocument();
        });
    });

    it('handles invalid QR code', async () => {
        render(
            <MemoryRouter>
                <QrScannerPage />
            </MemoryRouter>
        );

        const onScanSuccess = mockScannerRender.mock.calls[0][0];
        await act(async () => {
            onScanSuccess('invalid-payload');
        });

        await waitFor(() => {
            expect(screen.getByText(/Verification Failed/i)).toBeInTheDocument();
            expect(screen.getByText(/not a valid ByteSyntax parcel QR code/i)).toBeInTheDocument();
        });
    });

    it('handles mutation error', async () => {
        render(
            <MemoryRouter>
                <QrScannerPage />
            </MemoryRouter>
        );

        const onScanSuccess = mockScannerRender.mock.calls[0][0];

        mockCollectParcel.mockImplementation((id: number, options: any) => {
            options.onError(new Error('Backend error'));
        });

        await act(async () => {
            onScanSuccess('bs-parcel:123');
        });

        await waitFor(() => {
            expect(screen.getByText(/Verification Failed/i)).toBeInTheDocument();
            expect(screen.getByText(/Backend error/i)).toBeInTheDocument();
        });
    });
});
