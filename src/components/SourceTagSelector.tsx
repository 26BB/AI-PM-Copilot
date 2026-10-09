import React from 'react';

/**
 * Supported feedback source channels for categorizing customer complaints.
 */
export type SourceTag =
  | 'App Store'
  | 'Play Store'
  | 'G2 / Capterra'
  | 'Twitter / X'
  | 'Support Ticket'
  | 'User Interview'
  | 'Other';

/**
 * List of available feedback source tag options.
 */
export const SOURCE_TAG_OPTIONS: SourceTag[] = [
  'App Store',
  'Play Store',
  'G2 / Capterra',
  'Twitter / X',
  'Support Ticket',
  'User Interview',
  'Other',
];

export interface SourceTagSelectorProps {
  /** Currently selected feedback source tag, or null if none selected */
  selectedTag: SourceTag | null;
  /** Callback triggered when a source tag option is selected or toggled */
  onSelectTag: (tag: SourceTag | null) => void;
  /** Optional flag to disable tag selection inputs */
  disabled?: boolean;
  /** Optional custom CSS class name */
  className?: string;
}

/**
 * Returns an emoji icon representing the given feedback source channel.
 *
 * @param tag - SourceTag identifier
 * @returns Emoji icon string for UI display
 */
export function getSourceTagIcon(tag: SourceTag): string {
  switch (tag) {
    case 'App Store':
      return '🍎';
    case 'Play Store':
      return '🤖';
    case 'G2 / Capterra':
      return '⭐';
    case 'Twitter / X':
      return '💬';
    case 'Support Ticket':
      return '🎫';
    case 'User Interview':
      return '🎙️';
    case 'Other':
      return '📌';
    default:
      return '🏷️';
  }
}

/**
 * Renders an accessible selector component for filtering or tagging complaints
 * by feedback source channel.
 *
 * @param props - SourceTagSelectorProps configuring selection state and callbacks
 * @returns React JSX element displaying interactive source tag option pills
 */
export function SourceTagSelector({
  selectedTag,
  onSelectTag,
  disabled = false,
  className = '',
}: SourceTagSelectorProps): React.JSX.Element {
  const handleTagClick = (tag: SourceTag): void => {
    if (disabled) return;
    if (selectedTag === tag) {
      onSelectTag(null);
    } else {
      onSelectTag(tag);
    }
  };

  return (
    <div
      className={`source-tag-selector ${className}`.trim()}
      aria-label="Feedback Source Channel Selector"
      style={{ marginBottom: '12px' }}
    >
      <label className="source-tag-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4a5568', marginBottom: '6px' }}>
        Feedback Source Tag (Optional)
      </label>
      <div
        className="source-tag-pills"
        role="group"
        aria-label="Feedback source options"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}
      >
        {SOURCE_TAG_OPTIONS.map((tag) => {
          const isSelected = selectedTag === tag;
          const icon = getSourceTagIcon(tag);
          return (
            <button
              key={tag}
              type="button"
              disabled={disabled}
              onClick={() => handleTagClick(tag)}
              aria-pressed={isSelected}
              className={`source-tag-pill ${isSelected ? 'selected' : ''}`}
              style={{
                padding: '4px 10px',
                fontSize: '0.8rem',
                borderRadius: '16px',
                border: isSelected ? '1px solid #3182ce' : '1px solid #cbd5e0',
                backgroundColor: isSelected ? '#ebf8ff' : '#ffffff',
                color: isSelected ? '#2b6cb0' : '#4a5568',
                fontWeight: isSelected ? 600 : 400,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.6 : 1,
                transition: 'all 0.15s ease-in-out',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span aria-hidden="true">{icon}</span>
              <span>{tag}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
