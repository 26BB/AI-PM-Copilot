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
});
