/**
 * Category route for heuristic user complaint classification.
 */
export type ComplaintRoute = 'otp' | 'sso' | 'billing';

/**
 * Calculates a standard RICE (Reach, Impact, Confidence, Effort) priority score.
 *
 * WHY: Separating core mathematical scoring logic from test suites ensures production
 * algorithms can be reused across the application and tested independently without circular imports.
 *
 * @param reach - Estimated reach count (e.g. users impacted per month)
 * @param impact - Business impact multiplier (e.g. 0.5 = Low, 1 = Med, 2 = High, 3 = Massive)
 * @param confidence - Confidence percentage (e.g. 80 for 80%)
 * @param effort - Estimated effort in person-weeks or story points
 * @returns RICE score rounded to 1 decimal place, bounded to a minimum of 0.1
 */
export function calculateRiceScore(reach: number, impact: number, confidence: number, effort: number): number {
  // Clamps effort to a minimum floor of 0.5 to prevent division by zero or inflated scores
  const safeEffort = Math.max(0.5, effort);
  const score = ((reach / 1000) * impact * (confidence / 100)) / safeEffort;
  return Math.max(0.1, Math.round(score * 10) / 10);
}

/**
 * Routes raw user feedback to fallback categories using keyword heuristics.
 *
 * WHY: Heuristic routing provides an immediate fallback classification before or alongside
 * LLM synthesis, enabling deterministic fallback handling in offline or high-latency scenarios.
 *
 * @param complaint - Raw complaint or user feedback text
 * @returns Classified complaint route category ('sso' | 'billing' | 'otp')
 */
export function routeHeuristicComplaint(complaint: string): ComplaintRoute {
  const lower = complaint.toLowerCase();
  if (lower.includes('sso') || lower.includes('saml') || lower.includes('okta')) return 'sso';
  if (lower.includes('price') || lower.includes('invoice') || lower.includes('tax')) return 'billing';
  return 'otp';
}
