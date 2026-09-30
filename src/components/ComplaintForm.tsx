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

  return (\n    <form onSubmit={handleSubmit} className=\"complaint-form\" aria-label=\"Complaint Input Form\">\n      <div className=\"form-group\">\n        <label htmlFor=\"complaint-input\" className=\"form-label\">\n          Raw User Complaint or Feedback\n        </label>\n        <textarea\n          id=\"complaint-input\"\n          value={complaintText}\n          onChange={handleInputChange}\n          placeholder={placeholder}\n          disabled={disabled || isLoading}\n          rows={6}\n          className=\"form-textarea\"\n          aria-invalid={Boolean(validationError)}\n          aria-describedby={validationError ? 'complaint-error' : undefined}\n        />\n        <div className=\"form-footer\">\n          <span className=\"character-count\" aria-live=\"polite\">\n            {complaintText.length} characters\n          </span>\n          {validationError && (\n            <span id=\"complaint-error\" className=\"error-message\" role=\"alert\">\n              {validationError}\n            </span>\n          )}\n        </div>\n      </div>\n      <button\n        type=\"submit\"\n        disabled={disabled || isLoading || !complaintText.trim()}\n        className=\"submit-button\"\n      >\n        {isLoading ? 'Generating PRD...' : 'Generate PRD & RICE Score'}\n      </button>\n    </form>\n  );\n}