import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';
import React from 'react';

describe('Input', () => {
    it('renders with a label', () => {
        render(<Input label="Username" placeholder="Enter username" />);
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    });

    it('handles value changes', () => {
        render(<Input label="Username" />);
        const input = screen.getByLabelText('Username') as HTMLInputElement;

        fireEvent.change(input, { target: { value: 'johndoe' } });
        expect(input.value).toBe('johndoe');
    });

    it('displays error message when provided', () => {
        render(<Input label="Username" error="Invalid username" />);
        expect(screen.getByText('Invalid username')).toBeInTheDocument();
    });

    it('is disabled when the disabled prop is true', () => {
        render(<Input label="Username" disabled />);
        expect(screen.getByLabelText('Username')).toBeDisabled();
    });
});
