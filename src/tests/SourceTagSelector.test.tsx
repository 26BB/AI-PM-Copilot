/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  SourceTagSelector,
  getDefaultSourceTags,
  formatSourceTagLabel,
} from '../components/SourceTagSelector';

describe('SourceTagSelector Component', () => {
  /**
   * Real-world scenario: Product Manager opens the complaint input interface.
   * Expectation: All default feedback channel options (App Store, Twitter / X, etc.) are rendered.
   */
  it('renders all default source tags correctly', () => {
    const handleSelect = vi.fn();
    render(<SourceTagSelector selectedTag="App Store" onSelectTag={handleSelect} />);

    const tags = getDefaultSourceTags();
    tags.forEach((tag) => {
      const formattedLabel = formatSourceTagLabel(tag);
      expect(screen.getByRole('button', { name: formattedLabel })).toBeDefined();
    });
  });

  /**
   * Real-world scenario: PM clicks on "Twitter / X" source tag to categorize social feedback.
   * Expectation: Selection callback is invoked with 'Twitter / X'.
   */
  it('triggers onSelectTag callback when a source tag is clicked', () => {
    const handleSelect = vi.fn();
    render(<SourceTagSelector selectedTag="App Store" onSelectTag={handleSelect} />);

    const twitterButton = screen.getByRole('button', { name: formatSourceTagLabel('Twitter / X') });
    fireEvent.click(twitterButton);

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith('Twitter / X');
  });

  /**
   * Real-world scenario: Form is in submitting or disabled state.
   * Expectation: Tag buttons are disabled and do not respond to clicks.
   */
  it('disables all source tag buttons when disabled prop is true', () => {
    const handleSelect = vi.fn();
    render(<SourceTagSelector selectedTag="App Store" onSelectTag={handleSelect} disabled={true} />);

    const googlePlayButton = screen.getByRole('button', { name: formatSourceTagLabel('Google Play') });
    expect(googlePlayButton.hasAttribute('disabled')).toBe(true);

    fireEvent.click(googlePlayButton);
    expect(handleSelect).not.toHaveBeenCalled();
  });

  /**
   * Real-world scenario: Helper function formats tags with emoji icons for display.
   * Expectation: formatSourceTagLabel adds proper channel emojis.
   */
  it('formats source tag labels with matching emoji icons', () => {
    expect(formatSourceTagLabel('App Store')).toBe('🍏 App Store');
    expect(formatSourceTagLabel('Google Play')).toBe('🤖 Google Play');
    expect(formatSourceTagLabel('G2 / Capterra')).toBe('⭐ G2 / Capterra');
    expect(formatSourceTagLabel('Twitter / X')).toBe('🐦 Twitter / X');
    expect(formatSourceTagLabel('Customer Support')).toBe('🎧 Customer Support');
    expect(formatSourceTagLabel('User Interview')).toBe('💬 User Interview');
    expect(formatSourceTagLabel('Other')).toBe('📌 Other');
  });
});
