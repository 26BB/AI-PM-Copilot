/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrdSkeletonDisplay, normalizeAcceptanceCriteria } from '../components/PrdSkeletonDisplay';
import { PrdSkeleton } from '../services/geminiService';

describe('normalizeAcceptanceCriteria helper logic', () => {
  /**
   * Real-world scenario: Gemini API returns undefined or empty list for acceptance criteria.
   * Expectation: The helper function returns a default fallback criterion string array.
   */
  it('returns default fallback criterion when criteria array is undefined or empty', () => {
    const defaultFromUndefined = normalizeAcceptanceCriteria(undefined);
    expect(defaultFromUndefined).toEqual(['Feature functionality must be verified against expected behavior.']);

    const defaultFromEmpty = normalizeAcceptanceCriteria([]);
    expect(defaultFromEmpty).toEqual(['Feature functionality must be verified against expected behavior.']);
  });

  /**
   * Real-world scenario: Gemini API returns criteria with leading/trailing whitespace or empty strings.
   * Expectation: The helper trims strings and strips out purely whitespace entries.
   */
  it('trims whitespace and filters out empty strings from acceptance criteria', () => {
    const result = normalizeAcceptanceCriteria(['  First criterion  ', '   ', 'Second criterion']);
    expect(result).toEqual(['First criterion', 'Second criterion']);
  });
});

describe('PrdSkeletonDisplay Component', () => {
  const samplePrd: PrdSkeleton = {
    problemStatement: 'Checkout verification failed during flash sale due to OTP timeout.',
    userPersona: 'E-commerce Shopper',
    userStory: 'As a shopper, I want fast OTP delivery so that I can finish purchase.',
    acceptanceCriteria: [
      'OTP SMS delivered within 5 seconds',
      'Resend button enabled after 30 seconds',
    ],
  };

  /**
   * Real-world scenario: PM receives a generated PRD skeleton from Gemini API synthesis.
   * Expectation: The component displays problem statement, target user persona, user story, and acceptance criteria list clearly.
   */
  it('renders all PRD skeleton fields including problem statement, persona, user story, and acceptance criteria', () => {
    render(<PrdSkeletonDisplay prd={samplePrd} />);

    expect(screen.getByRole('heading', { name: /draft prd skeleton/i })).toBeDefined();
    expect(screen.getByText('Checkout verification failed during flash sale due to OTP timeout.')).toBeDefined();
    expect(screen.getByText('E-commerce Shopper')).toBeDefined();
    expect(screen.getByText('As a shopper, I want fast OTP delivery so that I can finish purchase.')).toBeDefined();
    expect(screen.getByText('OTP SMS delivered within 5 seconds')).toBeDefined();
    expect(screen.getByText('Resend button enabled after 30 seconds')).toBeDefined();
  });

  /**
   * Real-world scenario: Gemini API returns empty or fallback values for PRD fields.
   * Expectation: Component gracefully renders default fallback texts without throwing errors.
   */
  it('handles empty or missing PRD fields with fallback messages', () => {
    const emptyPrd: PrdSkeleton = {
      problemStatement: '',
      userPersona: '',
      userStory: '',
      acceptanceCriteria: [],
    };

    render(<PrdSkeletonDisplay prd={emptyPrd} />);

    expect(screen.getByText('Problem statement not specified.')).toBeDefined();
    expect(screen.getByText('Target User')).toBeDefined();
    expect(screen.getByText('As a user, I want features to work properly so that I can accomplish my goals.')).toBeDefined();
    expect(screen.getByText('Feature functionality must be verified against expected behavior.')).toBeDefined();
  });
});
