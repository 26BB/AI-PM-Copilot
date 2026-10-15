/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../main';

describe('App Mobile Responsive Layout', () => {
  /**
   * Real-world scenario: PM accesses AI-PM Copilot on a mobile screen viewport.
   * Expectation: Container element incorporates mobile-friendly layout styling with full width capabilities.
   */
  it('renders app container with fluid width and mobile responsive styling', () => {
    const { container } = render(<App />);
    const appContainer = container.querySelector('.app-container') as HTMLElement | null;

    expect(appContainer).not.toBeNull();
    expect(appContainer?.style.maxWidth).toBe('720px');
    expect(appContainer?.style.width).toBe('100%');
    expect(appContainer?.style.boxSizing).toBe('border-box');
  });

  /**
   * Real-world scenario: PM lands on AI-PM Copilot on a mobile browser.
   * Expectation: Heading text and header instructions render cleanly.
   */
  it('renders responsive header and title on mobile viewport', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1, name: /AI-PM Copilot/i });
    expect(heading).toBeDefined();

    const subtitle = screen.getByText(/Paste a raw user complaint to generate a PRD skeleton/i);
    expect(subtitle).toBeDefined();
  });
});
