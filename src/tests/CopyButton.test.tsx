/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CopyButton, copyToClipboard } from '../components/CopyButton';
import { render, screen, fireEvent, act } from '@testing-library/react';

describe('copyToClipboard function', () => {
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
      writable: true,
    });
  });

  /**
   * Real-world scenario: User clicks copy in a modern browser supporting standard navigator.clipboard API.
   * Expectation: copyToClipboard writes text to navigator.clipboard and returns true.
   */
  it('copies text using navigator.clipboard when API is available', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    const success = await copyToClipboard('Sample PRD Text');
    expect(success).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('Sample PRD Text');
  });

  /**
   * Real-world scenario: User's browser does not support navigator.clipboard (or clipboard API fails due to permissions).
   * Expectation: copyToClipboard falls back to document.execCommand('copy') and returns result.
   */
  it('falls back to document.execCommand when navigator.clipboard throws or is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
      writable: true,
    });

    const execCommandMock = vi.fn().mockReturnValue(true);
    document.execCommand = execCommandMock;

    const success = await copyToClipboard('Fallback text');
    expect(success).toBe(true);
    expect(execCommandMock).toHaveBeenCalledWith('copy');
  });
});

describe('CopyButton Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * Real-world scenario: Product Manager clicks copy button next to generated RICE score or PRD skeleton.
   * Expectation: Button state updates to show "Copied!" feedback and invokes optional onCopy callback.
   */
  it('updates button state to copied feedback and calls onCopy callback on click', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    const handleCopy = vi.fn();
    render(
      <CopyButton
        textToCopy="Reach: 5000 users/mo"
        label="Copy RICE Score"
        copiedLabel="RICE Score Copied!"
        onCopy={handleCopy}
      />
    );

    const button = screen.getByRole('button', { name: /copy rice score/i });
    expect(button).toBeDefined();

    await act(async () => {
      fireEvent.click(button);
    });

    expect(writeTextMock).toHaveBeenCalledWith('Reach: 5000 users/mo');
    expect(handleCopy).toHaveBeenCalledWith('Reach: 5000 users/mo');

    expect(screen.getByText(/RICE Score Copied!/i)).toBeDefined();

    // Fast-forward timer to verify feedback resets back to default label
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/Copy RICE Score/i)).toBeDefined();
  });

  /**
   * Real-world scenario: Copy button rendered without valid text to copy.
   * Expectation: Button is disabled so user cannot attempt empty copy operation.
   */
  it('disables button when textToCopy is empty', () => {
    render(<CopyButton textToCopy="" label="Copy Empty" />);
    const button = screen.getByRole('button', { name: /copy empty/i });
    expect(button.hasAttribute('disabled')).toBe(true);
  });
});
