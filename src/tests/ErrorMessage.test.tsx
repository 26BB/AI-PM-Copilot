import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage, formatErrorMessage } from '../components/ErrorMessage';

describe('ErrorMessage helper functions', () => {
  /**
   * Tests formatErrorMessage with string inputs including empty string fallbacks.
   */
  it('formats string error messages and falls back gracefully for empty strings', () => {
    expect(formatErrorMessage('API error occurred')).toBe('API error occurred');
    expect(formatErrorMessage('   ')).toBe('An unexpected error occurred. Please try again.');
  });

  /**
   * Tests formatErrorMessage with Error object instances.
   */
  it('extracts message property from Error object instances', () => {
    const errorObj = new Error('Network failure during fetch');
    expect(formatErrorMessage(errorObj)).toBe('Network failure during fetch');
  });
});

describe('ErrorMessage component rendering', () => {
  /**
   * Tests that ErrorMessage renders alert role and displays formatted error text.
   */
  it('renders banner with alert role and error text', () => {
    render(<ErrorMessage error="Failed to connect to Gemini API" />);
    const alertBanner = screen.getByRole('alert');
    expect(alertBanner).toBeDefined();
    expect(alertBanner.getAttribute('aria-live')).toBe('assertive');
    expect(screen.getByText('Failed to connect to Gemini API')).toBeDefined();
  });

  /**
   * Tests that Retry button renders and triggers callback when onRetry is provided.
   */
  it('renders Retry button and handles click event when onRetry callback is provided', () => {
    const handleRetry = vi.fn();
    render(<ErrorMessage error="Rate limit exceeded" onRetry={handleRetry} retryLabel="Retry Request" />);

    const retryBtn = screen.getByRole('button', { name: 'Retry Request' });
    expect(retryBtn).toBeDefined();

    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
