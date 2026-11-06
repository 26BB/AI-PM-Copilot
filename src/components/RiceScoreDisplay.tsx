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
 * Shared styling tokens for RICE metric grid items and labels to eliminate inline duplication.
 */
// WHY: Centralizing metric item styles reduces inline style duplication and ensures visual consistency across metrics
const metricStyles: {
  grid: React.CSSProperties;
  item: React.CSSProperties;
  label: React.CSSProperties;
  value: React.CSSProperties;
} = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    margin: '16px 0',
  },
  item: {
    padding: '8px',
    background: '#f7fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
  },
  label: {
    fontSize: '0.85rem',
    color: '#4a5568',
  },
  value: {
    fontWeight: '600',
  },
};

/**
 * Categorizes a numeric RICE score into a human-readable priority tier.
 *
 * @param score - Calculated RICE score
 * @returns Priority tier label ('High Priority', 'Medium Priority', or 'Low Priority')
 */
export function getPriorityTier(score: number): 'High Priority' | 'Medium Priority' | 'Low Priority' {
  // WHY: Non-finite inputs (e.g. NaN, null, undefined) must default safely to 'Low Priority'
  const numericScore = typeof score === 'number' && Number.isFinite(score) ? score : 0;
  if (numericScore >= 10) {
    return 'High Priority';
  }
  if (numericScore >= 3) {
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
  // WHY: Non-finite numbers (NaN, Infinity, undefined) cause formatting crashes or display "NaN"
  const safeValue = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  switch (type) {
    case 'reach':
      return `${safeValue.toLocaleString()} users/mo`;
    case 'impact':
      return `${safeValue.toFixed(1)} (scale 0.5–3.0)`;
    case 'confidence':
      return `${safeValue}%`;
    case 'effort':
      return `${safeValue} person-week${safeValue === 1 ? '' : 's'}`;
    case 'score':
      return `${safeValue.toFixed(1)}`;
    default:
      return `${safeValue}`;
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

  const metricsConfig: Array<{
    label: string;
    type: 'reach' | 'impact' | 'confidence' | 'effort';
    value: number;
  }> = [
    { label: 'Reach:', type: 'reach', value: riceScore.reach },
    { label: 'Impact:', type: 'impact', value: riceScore.impact },
    { label: 'Confidence:', type: 'confidence', value: riceScore.confidence },
    { label: 'Effort:', type: 'effort', value: riceScore.effort },
  ];

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
        <div className="rice-metrics-grid" style={metricStyles.grid}>
          {metricsConfig.map((metric) => (
            <div key={metric.type} className="rice-metric-item" style={metricStyles.item}>
              <div className="metric-label" style={metricStyles.label}>{metric.label}</div>
              <div className="metric-value" style={metricStyles.value}>{formatRiceMetric(metric.value, metric.type)}</div>
            </div>
          ))}
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
