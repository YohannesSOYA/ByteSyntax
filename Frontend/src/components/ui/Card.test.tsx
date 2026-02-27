import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Card } from './Card';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, whileHover, whileTap, initial, animate, ...props }: any) => (
            <div {...props}>{children}</div>
        ),
    },
}));

describe('Card', () => {
    it('renders children correctly', () => {
        render(<Card>Card Content</Card>);
        expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('applies glass styles when the glass prop is true', () => {
        const { container } = render(<Card glass>Glass Card</Card>);
        const div = container.firstChild as HTMLElement;
        expect(div.className).toContain('backdrop-blur-md');
    });

    it('applies default styles when the glass prop is false', () => {
        const { container } = render(<Card glass={false}>Default Card</Card>);
        const div = container.firstChild as HTMLElement;
        expect(div.className).toContain('bg-white');
        expect(div.className).not.toContain('backdrop-blur-md');
    });
});
