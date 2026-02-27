import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, type Mock } from 'vitest';
import React from 'react';
import { AnalyticsCards } from './AnalyticsCards';
import { useDashboardStats } from '../hooks/useDashboardStats';

// Mock hook
vi.mock('../hooks/useDashboardStats');

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

describe('AnalyticsCards', () => {
    it('renders loading skeletons when isLoading is true', () => {
        (useDashboardStats as Mock).mockReturnValue({
            data: null,
            isLoading: true
        });

        const { container } = render(<AnalyticsCards />);
        const skeletons = container.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders stat values when data is loaded', () => {
        (useDashboardStats as Mock).mockReturnValue({
            data: {
                pending_parcels: 10,
                collected_today: 5,
                arrived_today: 7
            },
            isLoading: false
        });

        render(<AnalyticsCards />);

        expect(screen.getByText('15')).toBeInTheDocument(); // Total Active: 10 + 5
        expect(screen.getByText('10')).toBeInTheDocument(); // Awaiting
        expect(screen.getByText('5')).toBeInTheDocument();  // Collected
        expect(screen.getByText('7')).toBeInTheDocument();  // Arrived
    });
});
