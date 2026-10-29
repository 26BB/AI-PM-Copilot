import React, { useState, ChangeEvent, FormEvent } from 'react';
import { SourceTagSelector, SourceTag } from './SourceTagSelector';

export interface ComplaintValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ComplaintFormProps {
  /** Callback fired when a valid raw complaint is submitted */
  onSubmit: (complaint: string, sourceTag?: SourceTag) => void | Promise<void>;
  /** Indicates if the AI analysis or request is currently loading */
  isLoading?: boolean;
  /** Custom placeholder text for the complaint textarea */
  placeholder?: string;
  /** Initial text value for the complaint input */
  initialValue?: string;
  /** Initial selected feedback source channel tag */
  initialSourceTag?: SourceTag;
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
  initialSourceTag = 'App Store',
  disabled = false,
}: ComplaintFormProps): React.JSX.Element {
  const [complaintText, setComplaintText] = useState<string>(initialValue);
  const [selectedTag, setSelectedTag] = useState<SourceTag>(initialSourceTag);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setComplaintText(e.target.value);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // WHY: Prevent re-submitting when form is disabled or an AI generation request is in progress
    if (disabled || isLoading) {
      return;
    }

    const validation = validateComplaint(complaintText);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid complaint input.');
      return;
    }

    setValidationError(null);
    void onSubmit(complaintText.trim(), selectedTag);
  };

  return (
    <form onSubmit={handleSubmit} className="complaint-form" aria-label="Complaint Input Form">
      <SourceTagSelector
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
        disabled={disabled || isLoading}
      />
      <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
        <label htmlFor="complaint-input" className="form-label" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#2d3748' }}>
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
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px', fontSize: '0.9rem', borderRadius: '6px', border: '1px solid #cbd5e0', fontFamily: 'inherit' }}
        />
        <div className="form-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#718096' }}>
          <span className="character-count" aria-live="polite">
            {complaintText.length} characters
          </span>
          {validationError && (
            <span id="complaint-error" className="error-message" role="alert" style={{ color: '#e53e3e', fontWeight: 500 }}>
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
          padding: '10px 16px',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: '#ffffff',
          backgroundColor: disabled || isLoading || !complaintText.trim() ? '#a0aec0' : '#3182ce',
          border: 'none',
          borderRadius: '6px',
          cursor: disabled || isLoading || !complaintText.trim() ? 'not-allowed' : 'pointer',
          width: '100%',
        }}
      >
        {isLoading ? 'Generating PRD...' : 'Generate PRD & RICE Score'}
      </button>
    </form>
  );
}
