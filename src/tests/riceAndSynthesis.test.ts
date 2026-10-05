import { describe, it, expect } from 'vitest';

export function calculateRiceScore(reach: number, impact: number, confidence: number, effort: number): number {
  const safeEffort = Math.max(0.5, effort);
  const score = ((reach / 1000) * impact * (confidence / 100)) / safeEffort;
  return Math.max(0.1, Math.round(score * 10) / 10);
}

export function routeHeuristicComplaint(complaint: string): 'otp' | 'sso' | 'billing' {
  const lower = complaint.toLowerCase();
  if (lower.includes('sso') || lower.includes('saml') || lower.includes('okta')) return 'sso';
  if (lower.includes('price') || lower.includes('invoice') || lower.includes('tax')) return 'billing';
  return 'otp';
}

describe('AI-PM Copilot Core Math & Routing (Beyoncé Rule)', () => {
  it('correctly calculates RICE score for standard inputs', () => {
    const score = calculateRiceScore(142000, 2.0, 85, 3.0);
    expect(score).toBe(80.5);
  });

  it('prevents division by zero or negative effort values', () => {
    const score = calculateRiceScore(10000, 1.0, 80, 0);
    expect(score).toBeGreaterThan(0);
    expect(Number.isFinite(score)).toBe(true);
  });

  it('routes SAML/SSO complaints to the enterprise identity fallback', () => {
    const route = routeHeuristicComplaint('Admins drop off when asked to configure Okta and SAML');
    expect(route).toBe('sso');
  });

  it('routes invoice & seat confusion to billing fallback', () => {
    const route = routeHeuristicComplaint('Unexpected seat overages on quarterly invoice');
    expect(route).toBe('billing');
  });

  it('defaults to OTP timeout flow when no specific keyword is matched', () => {
    const route = routeHeuristicComplaint('Checkout verification failed during flash sale');
    expect(route).toBe('otp');
  });

  /**
   * Real-World Scenario: Zero Reach Boundary or Negative Effort Safeguards
   * When a PM evaluates a niche feature with zero reach or negative effort estimates,
   * the algorithm must clamp effort to a safe minimum and guarantee a positive finite score.
   */
  it('handles zero reach and negative effort values gracefully', () => {
    const zeroReachScore = calculateRiceScore(0, 2.0, 80, 1.0);
    expect(zeroReachScore).toBe(0.1);

    const negativeEffortScore = calculateRiceScore(1000, 2.0, 80, -5.0);
    expect(negativeEffortScore).toBeGreaterThan(0);
    expect(Number.isFinite(negativeEffortScore)).toBe(true);
  });

  /**
   * Real-World Scenario: High Confidence Scaling and Extreme Inputs
   * PMs entering confidence percentages (including values above 100) or high reach numbers
   * should produce mathematically sound and finite RICE priority scores.
   */
  it('calculates score correctly for high confidence and large scale inputs', () => {
    const highConfScore = calculateRiceScore(50000, 3.0, 120, 2.0);
    expect(highConfScore).toBe(90);
    expect(Number.isFinite(highConfScore)).toBe(true);
  });

  /**
   * Real-World Scenario: Raw Feedback with Mixed Casing, Punctuation & Special Symbols
   * End users submit raw complaints in ALL CAPS with heavy punctuation (e.g., "URGENT!! Need INVOICE for TAX calculation!").
   * The router must normalize text, strip casing sensitivities, and route accurately to billing.
   */
  it('routes uppercase complaints with heavy punctuation to billing', () => {
    const route = routeHeuristicComplaint('URGENT!! We need our quarterly INVOICE with full TAX breakdown ASAP!');
    expect(route).toBe('billing');
  });

  /**
   * Real-World Scenario: Multi-Keyword Feedback (Enterprise Authentication vs Pricing Priority)
   * When user feedback mentions both billing ("PRICE") and authentication ("SAML SSO"),
   * enterprise authentication security issues ('sso') take precedence in heuristic routing.
   */
  it('prioritizes enterprise identity routing when both SSO and billing keywords are present', () => {
    const route = routeHeuristicComplaint('SAML SSO login failed after upgrading to higher PRICE tier');
    expect(route).toBe('sso');
  });

  /**
   * Real-World Scenario: Negative Reach or Impact Boundary Clamping
   * When user inputs invalid negative values for reach or impact, the calculation
   * must bound the resulting RICE score to the minimum score floor (0.1) without producing invalid or negative scores.
   */
  it('clamps RICE score to minimum floor when negative reach or impact is provided', () => {
    const negativeReachScore = calculateRiceScore(-1000, 2.0, 80, 2.0);
    expect(negativeReachScore).toBe(0.1);

    const negativeImpactScore = calculateRiceScore(1000, -2.0, 80, 2.0);
    expect(negativeImpactScore).toBe(0.1);
  });

  /**
   * Real-World Scenario: Multiline User Complaints with Excessive Whitespace
   * Support tickets and feedback forms frequently contain multiline text, tabs, and newlines.
   * The router must normalize text across newlines and route complaints containing billing terms accurately.
   */
  it('correctly routes multiline customer feedback with whitespace to billing', () => {
    const multilineComplaint = `
      Hello Support Team,

      We were charged double on our monthly invoice!
      Please issue a refund or correction for the tax amount.
    `;
    const route = routeHeuristicComplaint(multilineComplaint);
    expect(route).toBe('billing');
  });

  /**
   * Real-World Scenario: Negative Confidence Input Safeguard
   * If a user enters an invalid negative percentage for confidence, the RICE calculation
   * must bound the resulting score to the minimum score floor (0.1) without throwing or producing negative scores.
   */
  it('clamps RICE score to minimum floor when negative confidence is provided', () => {
    const negativeConfScore = calculateRiceScore(5000, 2.0, -50, 2.0);
    expect(negativeConfScore).toBe(0.1);
  });

  /**
   * Real-World Scenario: Enterprise User Complaints with Okta Integration Keywords and Hyphenated Terms
   * Support tickets regarding identity providers like Okta often include mixed-casing and punctuation
   * such as "Okta-Identity" or "[OKTA] auth error". The router must correctly classify these as 'sso'.
   */
  it('routes Okta enterprise identity complaints with hyphens and brackets to sso', () => {
    const route = routeHeuristicComplaint('[OKTA-IDENTITY] Users fail to sign in via OKTA widget after update.');
    expect(route).toBe('sso');
  });

  /**
   * Real-World Scenario: Near-Zero Fractional Effort Safeguard
   * When a PM inputs a near-zero fractional effort value (e.g. 0.1 engineer-weeks),
   * the algorithm must clamp effort to the minimum safe effort floor (0.5) to prevent
   * score explosion due to division by near-zero decimals.
   */
  it('clamps near-zero fractional effort to safe effort floor', () => {
    const score = calculateRiceScore(2500, 2.0, 100, 0.1);
    expect(score).toBe(10);
  });

  /**
   * Real-World Scenario: Financial Feedback with Currency Symbols and Tax Keyword Formatting
   * Support tickets for pricing adjustments or tax queries often include currency formatting
   * and mixed-casing (e.g. "$500 TAX charge on annual pricing tier").
   * The router must normalize the string and route the complaint to billing.
   */
  it('routes financial complaints with currency symbols and tax keywords to billing', () => {
    const route = routeHeuristicComplaint('Discrepancy found: $500 TAX charge listed under our annual PRICING plan.');
    expect(route).toBe('billing');
  });
});
