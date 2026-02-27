import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from './StatusBadge';
import React from 'react';

describe('StatusBadge', () => {
    it('renders Ready label for Pending status', () => {
        render(<StatusBadge status="Pending" />);
        expect(screen.getByText('Ready')).toBeInTheDocument();
    });

    it('renders Collected label for Collected status', () => {
        render(<StatusBadge status="Collected" />);
        expect(screen.getByText('Collected')).toBeInTheDocument();
    });
});
