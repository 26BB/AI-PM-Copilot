import React, { useState, ChangeEvent, FormEvent } from 'react';
import { SourceTag, SourceTagSelector } from './SourceTagSelector';

export interface ComplaintValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ComplaintFormProps {
  /** Callback fired when a valid raw complaint is submitted with optional source tag */
  onSubmit: (complaint: string, sourceTag?: SourceTag | null) => void | Promise<void>;
  /** Indicates if the AI analysis or request is currently loading */
  isLoading?: boolean;
  /** Custom placeholder text for the complaint textarea */
  placeholder?: string;
  /** Initial text value for the complaint input */
  initialValue?: string;
  /** Initial selected source tag */
  initialSourceTag?: SourceTag | null;
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
  initialSourceTag = null,
  disabled = false,
}: ComplaintFormProps): React.JSX.Element {
  const [complaintText, setComplaintText] = useState<string>(initialValue);
  const [selectedTag, setSelectedTag] = useState<SourceTag | null>(initialSourceTag);
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
    void onSubmit(complaintText.trim(), selectedTag);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="complaint-form"
      aria-label="Complaint Input Form"
      style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}
    >
      <SourceTagSelector
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        disabled={disabled || isLoading}
      />
      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        <label
          htmlFor="complaint-input"
          className="form-label"
          style={{ fontWeight: 600, fontSize: '0.9rem', color: '#2d3748' }}
        >
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
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #cbd5e0',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            resize: 'vertical',
          }}
          aria-invalid={Boolean(validationError)}
          aria-describedby={validationError ? 'complaint-error' : undefined}
        />
        <div className="form-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <span className="character-count" aria-live="polite" style={{ fontSize: '0.8rem', color: '#718096' }}>
            {complaintText.length} characters
          </span>
          {validationError && (
            <span id="complaint-error" className="error-message" role="alert" style={{ fontSize: '0.85rem', color: '#e53e3e', fontWeight: 500 }}>
              {validationError}
            </span>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={disabled || isLoading || !complaintText.trim()}
        className="submit-button"
        style={{
          alignSelf: 'flex-start',
          padding: '10px 18px',
          backgroundColor: disabled || isLoading || !complaintText.trim() ? '#cbd5e0' : '#3182ce',
          color: '#ffffff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 600,
          fontSize: '0.95rem',
          cursor: disabled || isLoading || !complaintText.trim() ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s ease',
        }}
      >
        {isLoading ? 'Generating PRD...' : 'Generate PRD & RICE Score'}
      </button>
    </form>
  );
}
