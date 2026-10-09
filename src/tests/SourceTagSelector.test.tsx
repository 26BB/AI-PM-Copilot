/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  SourceTagSelector,
  getSourceTagIcon,
  SOURCE_TAG_OPTIONS,
  SourceTag,
} from '../components/SourceTagSelector';

describe('SourceTagSelector Component', () => {
  /**
   * Real-world scenario: PM opens the complaint form and views options for categorizing the feedback source.
   * Expectation: Component renders all available source tag pills with appropriate icons and names.
   */
  it('renders all feedback source tag options', () => {
    render(<SourceTagSelector selectedTag={null} onSelectTag={() => {}} />);

    SOURCE_TAG_OPTIONS.forEach((tag) => {
      const button = screen.getByRole('button', { name: new RegExp(tag, 'i') });
      expect(button).toBeDefined();
    });
  });

  /**
   * Real-world scenario: PM clicks on 'App Store' pill to specify complaint channel context.
   * Expectation: Triggers onSelectTag callback with selected tag.
   */
  it('calls onSelectTag with the clicked tag when no tag is selected', () => {
    const handleSelect = vi.fn();
    render(<SourceTagSelector selectedTag={null} onSelectTag={handleSelect} />);

    const appStoreButton = screen.getByRole('button', { name: /App Store/i });
    fireEvent.click(appStoreButton);

    expect(handleSelect).toHaveBeenCalledWith('App Store');
  });

  /**
   * Real-world scenario: PM clicks on an already selected tag pill to deselect/toggle off.
   * Expectation: Triggers onSelectTag callback with null to clear tag selection.
   */
  it('calls onSelectTag with null when clicking an already selected tag', () => {
    const handleSelect = vi.fn();
    render(<SourceTagSelector selectedTag="G2 / Capterra" onSelectTag={handleSelect} />);

    const g2Button = screen.getByRole('button', { name: /G2 \/ Capterra/i });
    fireEvent.click(g2Button);

    expect(handleSelect).toHaveBeenCalledWith(null);
  });

  /**
   * Real-world scenario: Form is currently in loading state while AI analysis runs.
   * Expectation: Tag selection buttons are disabled and do not trigger callback clicks.
   */
  it('disables all tag buttons when disabled prop is true', () => {
    const handleSelect = vi.fn();
    render(<SourceTagSelector selectedTag={null} onSelectTag={handleSelect} disabled={true} />);

    const supportTicketButton = screen.getByRole('button', { name: /Support Ticket/i });
    expect(supportTicketButton.hasAttribute('disabled')).toBe(true);

    fireEvent.click(supportTicketButton);
    expect(handleSelect).not.toHaveBeenCalled();
  });

  /**
   * Real-world scenario: Rendering UI badges with icons for each source channel.
   * Expectation: Helper returns expected emoji for each SourceTag option.
   */
  it('returns correct icons for each feedback source channel', () => {
    expect(getSourceTagIcon('App Store')).toBe('🍎');
    expect(getSourceTagIcon('Play Store')).toBe('🤖');
    expect(getSourceTagIcon('G2 / Capterra')).toBe('⭐');
    expect(getSourceTagIcon('Twitter / X')).toBe('💬');
    expect(getSourceTagIcon('Support Ticket')).toBe('🎫');
    expect(getSourceTagIcon('User Interview')).toBe('🎙️');
    expect(getSourceTagIcon('Other')).toBe('📌');
    expect(getSourceTagIcon('Unknown' as SourceTag)).toBe('🏷️');
  });
});
