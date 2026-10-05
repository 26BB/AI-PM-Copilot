/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AbTestDisplay, normalizeAbTestSuggestion } from '../components/AbTestDisplay';
import { AbTestSuggestion } from '../services/geminiService';

describe('normalizeAbTestSuggestion helper logic', () => {
  /**
   * Real-world scenario: Gemini API returns an undefined or empty A/B test suggestion object.
   * Expectation: The helper function returns default fallback fields for hypothesis, control, test variant, and success metric.
   */
  it('returns default fallback values when abTest object or properties are undefined or empty', () => {
    const defaultFromUndefined = normalizeAbTestSuggestion(undefined);
    expect(defaultFromUndefined.hypothesis).toBe('Implementing proposed enhancement will improve user retention and conversion.');
    expect(defaultFromUndefined.controlVariant).toBe('Current user flow without modification');
    expect(defaultFromUndefined.testVariant).toBe('Optimized user flow addressing reported complaint');
    expect(defaultFromUndefined.successMetric).toBe('Primary conversion / completion rate');

    const defaultFromEmptyStrings = normalizeAbTestSuggestion({
      hypothesis: '   ',
      controlVariant: '',
      testVariant: '  ',
      successMetric: '',
    });
    expect(defaultFromEmptyStrings.hypothesis).toBe('Implementing proposed enhancement will improve user retention and conversion.');
    expect(defaultFromEmptyStrings.controlVariant).toBe('Current user flow without modification');
  });

  /**
   * Real-world scenario: Gemini API returns trimmed valid strings for hypothesis, variants, and metrics.
   * Expectation: The helper preserves valid inputs and trims extra surrounding whitespace.
   */
  it('preserves and trims valid hypothesis, variant, and metric strings', () => {
    const valid = normalizeAbTestSuggestion({
      hypothesis: '  Adding SMS OTP backup will reduce drop-offs by 15%.  ',
      controlVariant: '  Standard Email OTP only  ',
      testVariant: '  Choice between Email or SMS OTP  ',
      successMetric: '  Flash sale checkout completion rate  ',
    });

    expect(valid.hypothesis).toBe('Adding SMS OTP backup will reduce drop-offs by 15%.');
    expect(valid.controlVariant).toBe('Standard Email OTP only');
    expect(valid.testVariant).toBe('Choice between Email or SMS OTP');
    expect(valid.successMetric).toBe('Flash sale checkout completion rate');
  });
});

describe('AbTestDisplay Component', () => {
  const sampleAbTest: AbTestSuggestion = {
    hypothesis: 'Auto-retrying failed OTP requests will increase flash sale conversion by 12%.',
    controlVariant: 'Manual resend button after 30 seconds timer expiration.',
    testVariant: 'Background auto-retry on exponential backoff with instant status toast.',
    successMetric: 'Checkout completion rate within 2 minutes of initiation.',
  };

  /**
   * Real-world scenario: PM reviews generated A/B test setup suggestions for product experimentation.
   * Expectation: Component displays hypothesis, Control (Variant A), Treatment (Variant B), and primary success metric clearly.
   */
  it('renders hypothesis, control variant, treatment variant, and success metric', () => {
    render(<AbTestDisplay abTest={sampleAbTest} />);

    expect(screen.getByRole('heading', { name: /a\/b test suggestion/i })).toBeDefined();
    expect(screen.getByText('Auto-retrying failed OTP requests will increase flash sale conversion by 12%.')).toBeDefined();
    expect(screen.getByText('Control (Variant A)')).toBeDefined();
    expect(screen.getByText('Manual resend button after 30 seconds timer expiration.')).toBeDefined();
    expect(screen.getByText('Treatment (Variant B)')).toBeDefined();
    expect(screen.getByText('Background auto-retry on exponential backoff with instant status toast.')).toBeDefined();
    expect(screen.getByText('Checkout completion rate within 2 minutes of initiation.')).toBeDefined();
  });

  /**
   * Real-world scenario: Render component with fallback/partial values when API response misses fields.
   * Expectation: Render succeeds using default fallback descriptions.
   */
  it('renders gracefully with fallback values when partial props are passed', () => {
    const partialAbTest: Partial<AbTestSuggestion> = {
      hypothesis: 'Simplifying form fields will increase signups.',
    };

    render(<AbTestDisplay abTest={partialAbTest as AbTestSuggestion} />);

    expect(screen.getByText('Simplifying form fields will increase signups.')).toBeDefined();
    expect(screen.getByText('Current user flow without modification')).toBeDefined();
    expect(screen.getByText('Optimized user flow addressing reported complaint')).toBeDefined();
    expect(screen.getByText('Primary conversion / completion rate')).toBeDefined();
  });
});
