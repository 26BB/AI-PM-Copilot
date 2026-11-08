import React from 'react';

export interface ErrorMessageProps {
  /** Error message string, Error instance, or unknown caught exception object to display */
  error: string | Error | unknown;
  /** Optional callback fired when the user clicks the Retry button */
  onRetry?: () => void;
  /** Custom label for the retry action button */
  retryLabel?: string;
  /** Optional custom CSS class name for container styling */
  className?: string;
}

/**
 * Normalizes error inputs (Error objects, strings, API error payloads, or unknown values) into a sanitized error string.
 *
 * WHY: Async rejected promises, API responses, or catch blocks often receive non-Error objects
 * (e.g. `{ message: '...' }`, `{ error: '...' }`, raw strings, or null/undefined).
 * Normalizing unknown inputs safely prevents runtime TypeError crashes and ensures the UI always
 * displays a coherent, user-facing error message.
 *
 * @param err - Raw error object, string, or unknown exception value
 * @returns Cleaned, user-facing error message text
 */
export function formatErrorMessage(err: unknown): string {
  if (typeof err === 'string') {
    return err.trim() || 'An unexpected error occurred. Please try again.';
  }
  if (err && typeof err === 'object') {
    const candidate = err as Record<string, unknown>;
    if (typeof candidate.message === 'string' && candidate.message.trim()) {
      return candidate.message.trim();
    }
    if (typeof candidate.error === 'string' && candidate.error.trim()) {
      return candidate.error.trim();
    }
  }
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Accessible error banner component displaying error feedback with an optional retry action.
 *
 * @param props - ErrorMessageProps configuring error input, retry handler, and custom labels
 * @returns React JSX element rendering error message alert box
 */
export function ErrorMessage({
  error,
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}: ErrorMessageProps): React.JSX.Element {
  const messageText = formatErrorMessage(error);

  return (
    <div
      className={`error-message-banner ${className}`.trim()}
      role="alert"
      aria-live="assertive"
      style={{
        padding: '16px',
        backgroundColor: '#fff5f5',
        border: '1px solid #feb2b2',
        borderRadius: '6px',
        color: '#9b2c2c',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        margin: '16px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <span aria-hidden="true" style={{ fontSize: '1.2rem', lineHeight: 1 }}>
          ⚠️
        </span>
        <div style={{ flex: 1 }}>
          <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>
            Generation Failed
          </strong>
          <span className="error-text-content" style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
            {messageText}
          </span>
        </div>
      </div>

      {onRetry && (
        <div style={{ alignSelf: 'flex-end' }}>
          <button
            type="button"
            onClick={onRetry}
            className="retry-button"
            style={{
              padding: '6px 12px',
              backgroundColor: '#e53e3e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            {retryLabel}
          </button>
        </div>
      )}
    </div>
  );
}
