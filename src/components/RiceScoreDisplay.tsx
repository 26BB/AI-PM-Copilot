import React from 'react';
import { RiceScoreReasoning } from '../services/geminiService';
import { CopyButton } from './CopyButton';

export interface RiceScoreDisplayProps {
  /** RICE score breakdown and step-by-step reasoning details */
  riceScore: RiceScoreReasoning;
  /** Optional custom CSS class name for container styling */
  className?: string;
}

/**
 * Categorizes a numeric RICE score into a human-readable priority tier.
 *
 * @param score - Calculated RICE score
 * @returns Priority tier label ('High Priority', 'Medium Priority', or 'Low Priority')
 */
export function getPriorityTier(score: number): 'High Priority' | 'Medium Priority' | 'Low Priority' {
  if (score >= 10) {
    return 'High Priority';
  }
  if (score >= 3) {
    return 'Medium Priority';
  }
  return 'Low Priority';
}

/**
 * Formats individual RICE metrics into human-readable strings with appropriate units.
 *
 * @param value - Numeric metric value
 * @param type - Metric dimension key ('reach', 'impact', 'confidence', 'effort', 'score')
 * @returns Formatted metric string with units
 */
export function formatRiceMetric(
  value: number,
  type: 'reach' | 'impact' | 'confidence' | 'effort' | 'score'
): string {
  switch (type) {
    case 'reach':
      return `${value.toLocaleString()} users/mo`;
    case 'impact':
      return `${value.toFixed(1)} (scale 0.5–3.0)`;
    case 'confidence':
      return `${value}%`;
    case 'effort':
      return `${value} person-week${value === 1 ? '' : 's'}`;
    case 'score':
      return `${value.toFixed(1)}`;
    default:
      return `${value}`;
  }
}

/**
 * Formats a RICE score breakdown into plain text suitable for copying to clipboard.
 *
 * @param riceScore - RiceScoreReasoning object
 * @returns Formatted plain text string of RICE prioritization summary
 */
export function formatRiceSummaryText(riceScore: RiceScoreReasoning): string {
  const tier = getPriorityTier(riceScore.score);
  return `RICE Score: ${formatRiceMetric(riceScore.score, 'score')} (${tier})
- Reach: ${formatRiceMetric(riceScore.reach, 'reach')}
- Impact: ${formatRiceMetric(riceScore.impact, 'impact')}
- Confidence: ${formatRiceMetric(riceScore.confidence, 'confidence')}
- Effort: ${formatRiceMetric(riceScore.effort, 'effort')}

Reasoning:
${riceScore.reasoning || 'No specific reasoning provided.'}`;
}

/**
 * Renders the RICE Priority Score output component displaying calculated score,
 * priority tier badge, Reach/Impact/Confidence/Effort metrics grid, and step-by-step reasoning.
 *
 * @param props - RiceScoreDisplayProps containing the riceScore object and optional class name
 * @returns React JSX element displaying formatted RICE prioritization details
 */
export function RiceScoreDisplay({ riceScore, className = '' }: RiceScoreDisplayProps): React.JSX.Element {
  const priorityTier = getPriorityTier(riceScore.score);
  const tierClass = priorityTier.toLowerCase().replace(' ', '-');
  const copySummaryText = formatRiceSummaryText(riceScore);

  return (
    <section className={`rice-score-card ${className}`.trim()} aria-label="RICE Priority Score Output" style={{ marginTop: '20px' }}>
      <header className="rice-score-header" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 className="rice-score-title" style={{ margin: '0 0 8px 0' }}>📊 RICE Priority Score & Reasoning</h3>
          <div className="rice-badge-container" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span className="rice-score-badge" aria-label={`RICE Score: ${riceScore.score}`} style={{ fontWeight: 'bold' }}>
              RICE Score: {formatRiceMetric(riceScore.score, 'score')}
            </span>
            <span>•</span>
            <span className={`priority-tier-badge priority-${tierClass}`} aria-label={`Priority Tier: ${priorityTier}`} style={{ fontWeight: 'bold' }}>
              {priorityTier}
            </span>
          </div>
        </div>
        <CopyButton textToCopy={copySummaryText} label="Copy RICE Score" copiedLabel="RICE Score Copied!" />
      </header>

      <div className="rice-score-body">
        <div className="rice-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', margin: '16px 0' }}>
          <div className="rice-metric-item" style={{ padding: '8px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <div className="metric-label" style={{ fontSize: '0.85rem', color: '#4a5568' }}>Reach:</div>
            <div className="metric-value" style={{ fontWeight: '600' }}>{formatRiceMetric(riceScore.reach, 'reach')}</div>
          </div>

          <div className="rice-metric-item" style={{ padding: '8px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <div className="metric-label" style={{ fontSize: '0.85rem', color: '#4a5568' }}>Impact:</div>
            <div className="metric-value" style={{ fontWeight: '600' }}>{formatRiceMetric(riceScore.impact, 'impact')}</div>
          </div>

          <div className="rice-metric-item" style={{ padding: '8px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <div className="metric-label" style={{ fontSize: '0.85rem', color: '#4a5568' }}>Confidence:</div>
            <div className="metric-value" style={{ fontWeight: '600' }}>{formatRiceMetric(riceScore.confidence, 'confidence')}</div>
          </div>

          <div className="rice-metric-item" style={{ padding: '8px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
            <div className="metric-label" style={{ fontSize: '0.85rem', color: '#4a5568' }}>Effort:</div>
            <div className="metric-value" style={{ fontWeight: '600' }}>{formatRiceMetric(riceScore.effort, 'effort')}</div>
          </div>
        </div>

        <div className="rice-reasoning-section" style={{ marginTop: '16px' }}>
          <h4 className="rice-reasoning-title" style={{ marginBottom: '6px' }}>Step-by-Step Priority Reasoning</h4>
          <p className="rice-reasoning-content" style={{ margin: 0, lineHeight: 1.5 }}>
            {riceScore.reasoning || 'No specific reasoning provided for this RICE score calculation.'}
          </p>
        </div>
      </div>
    </section>
  );
}
