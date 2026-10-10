/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi } from 'vitest';
import { ComplaintForm, validateComplaint } from '../components/ComplaintForm';
import { render, screen, fireEvent } from '@testing-library/react';

describe('validateComplaint logic', () => {
  /**
   * Real-world scenario: User submits empty or whitespace-only feedback.
   * Expectation: Validation fails and alerts user that complaint cannot be empty.
   */
  it('rejects empty or whitespace-only complaint strings', () => {
    const emptyResult = validateComplaint('');
    expect(emptyResult.isValid).toBe(false);
    expect(emptyResult.error).toBe('Complaint text cannot be empty.');

    const whitespaceResult = validateComplaint('   \n\t ');
    expect(whitespaceResult.isValid).toBe(false);
    expect(whitespaceResult.error).toBe('Complaint text cannot be empty.');
  });

  /**
   * Real-world scenario: User submits an overly brief complaint like "too slow" or "fix this".
   * Expectation: Validation fails requiring at least 10 characters to build a meaningful PRD.
   */
  it('rejects complaints shorter than 10 characters', () => {
    const result = validateComplaint('Fix this');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Complaint text must be at least 10 characters long to generate a meaningful PRD.');
  });

  /**
   * Real-world scenario: User pastes a detailed customer complaint about authentication failure during checkout.
   * Expectation: Validation passes successfully.
   */
  it('accepts valid complaints with 10 or more characters', () => {
    const result = validateComplaint('Checkout verification failed during flash sale');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });
});

describe('ComplaintForm Component', () => {
  /**
   * Real-world scenario: PM lands on the AI-PM Copilot input page.
   * Expectation: The textarea, character counter, and submit button render cleanly with correct defaults.
   */
  it('renders input form elements with initial default state', () => {
    render(<ComplaintForm onSubmit={() => {}} />);

    const textarea = screen.getByRole('textbox', { name: /raw user complaint/i });
    expect(textarea).toBeDefined();

    const submitBtn = screen.getByRole('button', { name: /generate prd/i });
    expect(submitBtn).toBeDefined();
    expect(submitBtn.hasAttribute('disabled')).toBe(true);

    const countText = screen.getByText(/0 characters/i);
    expect(countText).toBeDefined();
  });

  /**
   * Real-world scenario: PM types in a customer complaint and clicks submit.
   * Expectation: onSubmit handler is invoked with trimmed complaint text.
   */
  it('updates input state and calls onSubmit with trimmed complaint text upon submission', () => {
    const handleSubmit = vi.fn();
    render(<ComplaintForm onSubmit={handleSubmit} />);

    const textarea = screen.getByRole('textbox', { name: /raw user complaint/i });
    fireEvent.change(textarea, { target: { value: ' Users cannot complete SAML SSO login on Safari ' } });

    expect(screen.getByText(/48 characters/i)).toBeDefined();

    const form = screen.getByRole('form', { name: /complaint input form/i });
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith('Users cannot complete SAML SSO login on Safari', 'App Store');
  });

  /**
   * Real-world scenario: PM enters a sub-10 character string and submits via form submit.
   * Expectation: Validation error message appears and onSubmit is not called.
   */
  it('displays validation error when attempting to submit short complaint text', () => {
    const handleSubmit = vi.fn();
    render(<ComplaintForm onSubmit={handleSubmit} />);

    const textarea = screen.getByRole('textbox', { name: /raw user complaint/i });
    fireEvent.change(textarea, { target: { value: 'Buggy' } });

    const form = screen.getByRole('form', { name: /complaint input form/i });
    fireEvent.submit(form);

    expect(screen.getByText('Complaint text must be at least 10 characters long to generate a meaningful PRD.')).toBeDefined();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  /**
   * Real-world scenario: AI backend request is currently processing.
   * Expectation: Form controls are disabled and button indicates loading state.
   */
  it('disables textarea and shows loading button text when isLoading is true', () => {
    render(<ComplaintForm onSubmit={() => {}} isLoading={true} initialValue="Valid complaint text over ten chars" />);

    const textarea = screen.getByRole('textbox', { name: /raw user complaint/i });
    expect(textarea.hasAttribute('disabled')).toBe(true);

    const submitBtn = screen.getByRole('button', { name: /generating prd/i });
    expect(submitBtn).toBeDefined();
    expect(submitBtn.hasAttribute('disabled')).toBe(true);
  });
});
