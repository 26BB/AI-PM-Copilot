import React, { useState, ChangeEvent, FormEvent } from 'react';

export interface ComplaintValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ComplaintFormProps {
  /** Callback fired when a valid raw complaint is submitted */
  onSubmit: (complaint: string) => void | Promise<void>;
  /** Indicates if the AI analysis or request is currently loading */
  isLoading?: boolean;
  /** Custom placeholder text for the complaint textarea */
  placeholder?: string;
  /** Initial text value for the complaint input */
  initialValue?: string;
  /** Disables the input form when true */
  disabled?: boolean;
}

/**
 * Validates raw complaint input string for minimum length and quality requirements.
 *
 * @param complaint - Raw user feedback or complaint input
 * @returns ComplaintValidationResult indicating if input is valid and any validation error message
 */
export function validateComplaint(complaint: string): ComplaintValidationResult {
  const trimmed = complaint.trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Complaint text cannot be empty.',
    };
  }

  if (trimmed.length < 10) {
    return {
      isValid: false,
      error: 'Complaint text must be at least 10 characters long to generate a meaningful PRD.',
    };
  }

  return { isValid: true };
}

/**
 * React component for capturing raw user complaints with live character count,
 * validation feedback, and submit actions.
 *
 * @param props - ComplaintFormProps configuring submission handler and initial states
 */
export function ComplaintForm({
  onSubmit,
  isLoading = false,
  placeholder = 'Paste user complaint, feedback, or app review here (e.g. "Checkout verification failed during flash sale")...',
  initialValue = '',
  disabled = false,
}: ComplaintFormProps): React.JSX.Element {
  const [complaintText, setComplaintText] = useState<string>(initialValue);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setComplaintText(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const validation = validateComplaint(complaintText);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid complaint input.');
      return;
    }

    setValidationError(null);
    void onSubmit(complaintText.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="complaint-form" aria-label="Complaint Input Form">
      <div className="form-group">
        <label htmlFor="complaint-input" className="form-label">
          Raw User Complaint or Feedback
        </label>
        <textarea
          id="complaint-input"
          value={complaintText}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          rows={6}
          className="form-textarea"
          aria-invalid={Boolean(validationError)}
          aria-describedby={validationError ? 'complaint-error' : undefined}
        />
        <div className="form-footer">
          <span className="character-count" aria-live="polite">
            {complaintText.length} characters
          </span>
          {validationError && (
            <span id="complaint-error" className="error-message" role="alert">
              {validationError}
            </span>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={disabled || isLoading || !complaintText.trim()}
        className="submit-button"
      >
        {isLoading ? 'Generating PRD...' : 'Generate PRD & RICE Score'}
      </button>
    </form>
  );
}
