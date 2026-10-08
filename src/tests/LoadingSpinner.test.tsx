import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner, getLoadingMessage } from '../components/LoadingSpinner';

describe('LoadingSpinner helper functions', () => {
  /**
   * Tests that getLoadingMessage falls back to the default message when empty or undefined input is provided.
   */
  it('returns default loading message when customMessage is undefined or whitespace', () => {
    expect(getLoadingMessage()).toBe('Analyzing user complaint with Gemini AI...');
    expect(getLoadingMessage('   ')).toBe('Analyzing user complaint with Gemini AI...');
  });

  /**
   * Tests that getLoadingMessage returns trimmed custom message when provided.
   */
  it('returns trimmed custom message when a non-empty string is provided', () => {
    expect(getLoadingMessage('  Processing request...  ')).toBe('Processing request...');
  });
});

describe('LoadingSpinner component rendering', () => {
  /**
   * Tests that LoadingSpinner renders with default message and accessible role status.
   */
  it('renders spinner with default message and status role for accessibility', () => {
    render(<LoadingSpinner />);
    const statusContainer = screen.getByRole('status');
    expect(statusContainer).toBeDefined();
    expect(statusContainer.getAttribute('aria-live')).toBe('polite');
    expect(screen.getByText('Analyzing user complaint with Gemini AI...')).toBeDefined();
  });

  /**
   * Tests that LoadingSpinner displays custom message when supplied via props.
   */
  it('renders custom message provided via props', () => {
    render(<LoadingSpinner message="Generating PRD skeleton..." />);
    expect(screen.getByText('Generating PRD skeleton...')).toBeDefined();
  });
});
