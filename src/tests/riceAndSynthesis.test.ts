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
   * Real-World Scenario: Zero Impact or Zero Confidence Floor Clamping
   * When a PM scores an idea with zero impact or zero confidence level,
   * the score calculation must clamp to the baseline minimum floor of 0.1 to avoid 0 values in ranking matrices.
   */
  it('clamps RICE score to minimum floor when zero impact or zero confidence is provided', () => {
    const zeroImpactScore = calculateRiceScore(5000, 0, 80, 2.0);
    expect(zeroImpactScore).toBe(0.1);

    const zeroConfScore = calculateRiceScore(5000, 2.0, 0, 2.0);
    expect(zeroConfScore).toBe(0.1);
  });

  /**
   * Real-World Scenario: Customer Feedback Containing URLs and Special Query Parameters
   * End users or automated support systems submit issue descriptions containing direct links
   * to billing portals or invoices (e.g., "https://app.com/invoice?id=123&tax=true").
   * The router must analyze the URL path parameters and route appropriately to billing.
   */
  it('routes feedback containing invoice URLs and query parameters to billing', () => {
    const route = routeHeuristicComplaint('User reported an issue visiting https://portal.company.com/billing/invoice?tax_id=9982');
    expect(route).toBe('billing');
  });

  /**
   * Real-World Scenario: Sub-Day or Fractional Effort Estimate Clamping
   * When a PM inputs a small sub-day effort estimate (e.g., 0.1 person-weeks for a minor copy change),
   * the calculation clamps effort to a minimum floor of 0.5 to prevent unreasonably inflated RICE scores.
   */
  it('clamps fractional effort inputs below 0.5 to the minimum effort floor', () => {
    const score = calculateRiceScore(2000, 1.0, 100, 0.1);
    expect(score).toBe(4.0);
  });

  /**
   * Real-World Scenario: Multi-Keyword Precedence with Billing Keywords Appearing First
   * In support complaints where pricing or invoicing issues lead to authentication lockouts (e.g., "PRICE plan upgrade broke SAML SSO logins"),
   * enterprise identity routing ('sso') must take priority over billing fallback regardless of keyword order.
   */
  it('prioritizes enterprise identity routing when billing keyword appears before SSO keyword', () => {
    const route = routeHeuristicComplaint('The new PRICE tier broke our SAML SSO login integration');
    expect(route).toBe('sso');
  });

  /**
   * Real-World Scenario: Raw Support Complaints with Currency Symbols and Numbers
   * End users frequently submit bug reports containing currency symbols, numeric amounts, and capitalized billing keywords
   * (e.g., "CHARGED $1,250.00 ON INVOICE WITH TAX ERROR!"). The router must parse keywords accurately and route to billing.
   */
  it('routes feedback with currency symbols and capitalized keywords to billing', () => {
    const route = routeHeuristicComplaint('CHARGED $1,250.00 ON INVOICE WITH TAX ERROR!');
    expect(route).toBe('billing');
  });

  /**
   * Real-World Scenario: Small Scale Niche Feature or Pilot Launch RICE Scoring
   * When evaluating niche features or localized beta tests with small reach numbers (e.g., 500 users per month),
   * the score calculation must accurately evaluate fractional reach calculations ((500/1000) * 1.5 * 0.9 / 1.0 = 0.675 -> 0.7).
   */
  it('correctly calculates RICE score for fractional reach and decimal parameters', () => {
    const score = calculateRiceScore(500, 1.5, 90, 1.0);
    expect(score).toBe(0.7);
    expect(Number.isFinite(score)).toBe(true);
  });

  /**
   * Real-World Scenario: Support Tickets with Tax and Invoice Queries
   * Customers contacting support regarding billing discrepancies often express concerns about tax calculations or invoice receipts.
   * The router must identify words like "taxes" or "invoice" in mixed text and route them to the billing fallback.
   */
  it('routes feedback containing billing and tax keywords accurately to billing', () => {
    const route = routeHeuristicComplaint('Need tax breakdown and automated invoice receipt for corporate accounting');
    expect(route).toBe('billing');
  });

  /**
   * Real-World Scenario: General Authentication and One-Time Verification Failures
   * Customer complaints regarding SMS verification codes, 2FA logins, or login timeouts that do not mention SSO or Okta
   * should default to the OTP fallback route.
   */
  it('routes SMS and multi-factor verification complaints to default OTP flow', () => {
    const route = routeHeuristicComplaint('SMS verification code expired before user entered it on mobile');
    expect(route).toBe('otp');
  });

  /**
   * Real-World Scenario: URL Query Parameters and Encoded Billing Tokens in Webhook Payloads
   * Automated webhook complaints or user ticket descriptions often include direct URL links with embedded parameters
   * like "invoice_id=9901&tax_exempt=true". The router must handle URL-encoded characters and parameter strings accurately.
   */
  it('routes webhook feedback with URL parameters containing tax and invoice flags to billing', () => {
    const route = routeHeuristicComplaint('Webhook notification failed for event https://api.billing.com/v1/tax%20adjustment?invoice_id=INV-9021');
    expect(route).toBe('billing');
  });

  /**
   * Real-World Scenario: Scale Growth Evaluation with Over-100 Confidence and Fractional Metrics
   * When evaluating high-growth features with large reach (e.g., 250,000 users), fractional impact (1.5), confidence over 100% (150%),
   * and high effort (10.0), the formula must scale predictably and produce an exact, properly rounded score.
   */
  it('calculates expected score for large reach, high confidence (>100%), and fractional impact', () => {
    const score = calculateRiceScore(250000, 1.5, 150, 10.0);
    expect(score).toBe(56.3);
    expect(Number.isFinite(score)).toBe(true);
  });
});
