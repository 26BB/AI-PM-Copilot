import React from 'react';

/** Supported customer feedback source channel tags */
export type SourceTag =
  | 'App Store'
  | 'Google Play'
  | 'G2 / Capterra'
  | 'Twitter / X'
  | 'Customer Support'
  | 'User Interview'
  | 'Other';

export interface SourceTagSelectorProps {
  /** Currently selected feedback source tag */
  selectedTag: SourceTag;
  /** Callback fired when a source tag option is selected */
  onSelectTag: (tag: SourceTag) => void;
  /** Optional custom list of available tags */
  availableTags?: SourceTag[];
  /** Disables tag selection interaction when true */
  disabled?: boolean;
  /** Optional custom CSS class name for container styling */
  className?: string;
}

/**
 * Returns the default list of predefined customer feedback source tags.
 *
 * @returns Array of default SourceTag options
 */
export function getDefaultSourceTags(): SourceTag[] {
  return [
    'App Store',
    'Google Play',
    'G2 / Capterra',
    'Twitter / X',
    'Customer Support',
    'User Interview',
    'Other',
  ];
}

/**
 * Formats a SourceTag into a displayable badge label with an associated icon emoji.
 *
 * @param tag - Selected SourceTag
 * @returns Formatted string containing emoji icon and tag name
 */
export function formatSourceTagLabel(tag: SourceTag): string {
  switch (tag) {
    case 'App Store':
      return '🍏 App Store';
    case 'Google Play':
      return '🤖 Google Play';
    case 'G2 / Capterra':
      return '⭐ G2 / Capterra';
    case 'Twitter / X':
      return '🐦 Twitter / X';
    case 'Customer Support':
      return '🎧 Customer Support';
    case 'User Interview':
      return '💬 User Interview';
    case 'Other':
      return '📌 Other';
    default:
      return `📌 ${tag}`;
  }
}

/**
 * Source Tag Selector component allowing Product Managers to categorize
 * the origin channel of customer complaints and feedback.
 *
 * @param props - SourceTagSelectorProps configuring selection state and callbacks
 * @returns React JSX element rendering interactive source tag badges
 */
export function SourceTagSelector({
  selectedTag,
  onSelectTag,
  availableTags = getDefaultSourceTags(),
  disabled = false,
  className = '',
}: SourceTagSelectorProps): React.JSX.Element {
  return (
    <div
      className={`source-tag-selector ${className}`.trim()}
      aria-label="Feedback Source Channel Selector"
      style={{ marginBottom: '16px' }}
    >
      <label
        htmlFor="source-tag-group"
        style={{
          display: 'block',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#2d3748',
          marginBottom: '8px',
        }}
      >
        Feedback Source Context
      </label>
      <div
        id="source-tag-group"
        role="group"
        aria-label="Select source channel"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {availableTags.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => !disabled && onSelectTag(tag)}
              disabled={disabled}
              aria-pressed={isSelected}
              style={{
                padding: '6px 12px',
                fontSize: '0.85rem',
                fontWeight: isSelected ? 600 : 400,
                borderRadius: '16px',
                border: isSelected ? '1px solid #3182ce' : '1px solid #e2e8f0',
                backgroundColor: isSelected ? '#ebf8ff' : '#f7fafc',
                color: isSelected ? '#2b6cb0' : '#4a5568',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                transition: 'all 0.15s ease-in-out',
              }}
            >
              {formatSourceTagLabel(tag)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
