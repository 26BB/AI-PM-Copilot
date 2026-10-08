import React from 'react';

export interface LoadingSpinnerProps {
  /** Optional message displayed alongside or below the spinner */
  message?: string;
  /** Optional CSS class name for styling container */
  className?: string;
  /** Size of the spinner ring in pixels (defaults to 32) */
  size?: number;
}

/**
 * Returns a default user-friendly loading message if no custom message is provided.
 *
 * @param customMessage - Optional user-provided message string
 * @returns Non-empty loading status string
 */
export function getLoadingMessage(customMessage?: string): string {
  if (customMessage && customMessage.trim()) {
    return customMessage.trim();
  }
  return 'Analyzing user complaint with Gemini AI...';
}

/**
 * Accessible loading spinner component indicating async AI generation or network state.
 *
 * @param props - LoadingSpinnerProps configuring message, size, and container styling
 * @returns React JSX element with ARIA live region and animated visual indicator
 */
export function LoadingSpinner({
  message,
  className = '',
  size = 32,
}: LoadingSpinnerProps): React.JSX.Element {
  const displayMessage = getLoadingMessage(message);

  return (
    <div
      className={`loading-spinner-container ${className}`.trim()}
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        gap: '12px',
      }}
    >
      <div
        className="spinner-ring"
        aria-hidden="true"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: '3px solid #e2e8f0',
          borderTopColor: '#3182ce',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p
        className="spinner-message"
        style={{
          margin: 0,
          fontSize: '0.95rem',
          color: '#4a5568',
          fontWeight: 500,
        }}
      >
        {displayMessage}
      </p>
    </div>
  );
}
