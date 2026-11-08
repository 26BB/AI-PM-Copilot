import React from 'react';

export interface ErrorMessageProps {
  /** Error message string or Error instance to display */
  error: string | Error;
  /** Optional callback fired when the user clicks the Retry button */
  onRetry?: () => void;
  /** Custom label for the retry action button */
  retryLabel?: string;
  /** Optional custom CSS class name for container styling */
  className?: string;
}

/**
 * Normalizes error inputs (Error objects or strings) into a sanitized error string.
 *
 * @param err - Raw error object or string
 * @returns Cleaned, user-facing error message text
 */
export function formatErrorMessage(err: string | Error): string {
  if (typeof err === 'string') {
    return err.trim() || 'An unexpected error occurred. Please try again.';
  }
  if (err && err.message && err.message.trim()) {
    return err.message.trim();
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
    >
      <p className="error-text">
        {messageText}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="retry-button"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
