/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AbTestDisplay, formatAbTestMetric } from '../components/AbTestDisplay';
import { AbTestSuggestion } from '../services/geminiService';

describe('formatAbTestMetric helper logic', () => {
  /**
   * Real-world scenario: Gemini API returns undefined or empty metric string.
   * Expectation: Helper function returns default metric fallback 'Conversion / Completion Rate'.
   */
  it('returns default metric fallback when input metric is undefined or empty string', () => {
    expect(formatAbTestMetric(undefined)).toBe('Conversion / Completion Rate');
    expect(formatAbTestMetric('')).toBe('Conversion / Completion Rate');
    expect(formatAbTestMetric('   ')).toBe('Conversion / Completion Rate');
  });

  /**
   * Real-world scenario: Gemini API returns a valid metric string with surrounding whitespace.
   * Expectation: Helper function returns trimmed metric string.
   */
  it('trims leading and trailing whitespace from valid success metrics', () => {
    expect(formatAbTestMetric('  SAML SSO Success Rate  ')).toBe('SAML SSO Success Rate');
  });
});

describe('AbTestDisplay Component', () => {
  const sampleAbTest: AbTestSuggestion = {
    hypothesis: 'Adding WhatsApp OTP option will increase flash sale conversions by reducing SMS latency.',
    controlVariant: 'Standard SMS-only OTP verification step.',
    testVariant: 'Dual option selector allowing user to choose SMS or WhatsApp OTP delivery.',
    successMetric: 'Flash Sale Checkout Completion Rate',
  };

  /**
   * Real-world scenario: PM receives an AI-generated A/B experiment suggestion for a checkout complaint.
   * Expectation: Component renders hypothesis, control variant A, test variant B, and success metric cleanly.
   */
  it('renders hypothesis, control variant, test variant, and primary success metric', () => {
    render(<AbTestDisplay abTest={sampleAbTest} />);

    expect(screen.getByRole('heading', { name: /a\/b test suggestion/i })).toBeDefined();
    expect(
      screen.getByText('Adding WhatsApp OTP option will increase flash sale conversions by reducing SMS latency.')
    ).toBeDefined();
    expect(screen.getByText('Control Variant (A):')).toBeDefined();
    expect(screen.getByText('Standard SMS-only OTP verification step.')).toBeDefined();
    expect(screen.getByText('Test Variant (B):')).toBeDefined();
    expect(
      screen.getByText('Dual option selector allowing user to choose SMS or WhatsApp OTP delivery.')
    ).toBeDefined();
    expect(screen.getByText('Primary Success Metric:')).toBeDefined();
    expect(screen.getByText('Flash Sale Checkout Completion Rate')).toBeDefined();
  });

  /**
   * Real-world scenario: Gemini API returns empty or missing strings for A/B test fields.
   * Expectation: Component displays graceful fallback descriptions for all sections.
   */
  it('displays default fallbacks when A/B test fields are empty', () => {
    const emptyAbTest: AbTestSuggestion = {
      hypothesis: '',
      controlVariant: '',
      testVariant: '',
      successMetric: '',
    };

    render(<AbTestDisplay abTest={emptyAbTest} />);

    expect(screen.getByText('Implementing proposed changes will resolve customer friction.')).toBeDefined();
    expect(screen.getByText('Current baseline experience')).toBeDefined();
    expect(screen.getByText('Proposed solution experience')).toBeDefined();
    expect(screen.getByText('Conversion / Completion Rate')).toBeDefined();
  });
});
