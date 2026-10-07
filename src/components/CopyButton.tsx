import React, { useState } from 'react';

export interface CopyButtonProps {
  /** The text content to be copied to the user's clipboard */
  textToCopy: string;
  /** Custom label displayed on the button before copying (defaults to "Copy") */
  label?: string;
  /** Custom feedback label displayed after successfully copying (defaults to "Copied!") */
  copiedLabel?: string;
  /** Duration in milliseconds to display the copied confirmation state (defaults to 2000ms) */
  resetTimeoutMs?: number;
  /** Optional custom CSS class name for styling */
  className?: string;
  /** Optional callback fired when text is successfully copied */
  onCopy?: (copiedText: string) => void;
}

/**
 * Copies specified string content to clipboard using the browser Clipboard API with fallback.
 *
 * @param text - Plain text string to copy to clipboard
 * @returns Promise resolving to boolean indicating copy success status
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Ignore clipboard error and fall through to document.execCommand fallback
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

/**
 * Interactive button component for copying PM artifacts to the user's clipboard,
 * providing visual feedback confirmation upon copy action.
 *
 * @param props - CopyButtonProps configuring content to copy, labels, and callbacks
 * @returns React JSX element rendering copy button with stateful feedback
 */
export function CopyButton({
  textToCopy,
  label = 'Copy',
  copiedLabel = 'Copied!',
  resetTimeoutMs = 2000,
  className = '',
  onCopy,
}: CopyButtonProps): React.JSX.Element {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = async (): Promise<void> => {
    if (!textToCopy) return;

    const success = await copyToClipboard(textToCopy);
    if (success) {
      setIsCopied(true);
      if (onCopy) {
        onCopy(textToCopy);
      }
      setTimeout(() => {
        setIsCopied(false);
      }, resetTimeoutMs);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      className={`copy-button ${isCopied ? 'copied' : ''} ${className}`.trim()}
      aria-label={isCopied ? copiedLabel : label}
      title={label}
      disabled={!textToCopy}
      style={{
        cursor: textToCopy ? 'pointer' : 'not-allowed',
        padding: '4px 8px',
        fontSize: '0.85rem',
        borderRadius: '4px',
        border: '1px solid #cbd5e0',
        backgroundColor: isCopied ? '#c6f6d5' : '#edf2f7',
        color: isCopied ? '#22543d' : '#2d3748',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {isCopied ? `✓ ${copiedLabel}` : `📋 ${label}`}
    </button>
  );
}
