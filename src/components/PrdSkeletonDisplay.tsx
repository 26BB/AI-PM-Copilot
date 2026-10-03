import React from 'react';
import { PrdSkeleton } from '../services/geminiService';

export interface PrdSkeletonDisplayProps {
  /** The PRD skeleton containing problem statement, persona, user story, and acceptance criteria */
  prd: PrdSkeleton;
  /** Optional custom CSS class name for container styling */
  className?: string;
}

/**
 * Normalizes an array of acceptance criteria strings, ensuring no empty or whitespace items are returned.
 * Fallbacks to a default criterion if the list is empty.
 *
 * @param criteria - Raw list of acceptance criteria strings
 * @returns Cleaned array of non-empty acceptance criteria
 */
export function normalizeAcceptanceCriteria(criteria?: string[]): string[] {
  if (!criteria || !Array.isArray(criteria)) {
    return ['Feature functionality must be verified against expected behavior.'];
  }
  const filtered = criteria.map((item) => item.trim()).filter((item) => item.length > 0);
  if (filtered.length === 0) {
    return ['Feature functionality must be verified against expected behavior.'];
  }
  return filtered;
}

/**
 * Renders the PRD Skeleton output component displaying problem statement, target persona,
 * user story, and structured acceptance criteria list.
 *
 * @param props - PrdSkeletonDisplayProps containing the prd object and optional class name
 * @returns React JSX element displaying the formatted PRD draft skeleton
 */
export function PrdSkeletonDisplay({ prd, className = '' }: PrdSkeletonDisplayProps): React.JSX.Element {
  const criteriaList = normalizeAcceptanceCriteria(prd.acceptanceCriteria);

  return (
    <section className={`prd-skeleton-card ${className}`.trim()} aria-label="PRD Skeleton Output">
      <header className="prd-skeleton-header">
        <h3 className="prd-skeleton-title">📋 Draft PRD Skeleton</h3>
      </header>

      <div className="prd-skeleton-body">
        <div className="prd-section problem-statement-section">
          <h4 className="prd-section-title">Problem Statement</h4>
          <p className="prd-section-content">{prd.problemStatement || 'Problem statement not specified.'}</p>
        </div>

        <div className="prd-section user-persona-section">
          <h4 className="prd-section-title">User Persona</h4>
          <p className="prd-section-content">{prd.userPersona || 'Target User'}</p>
        </div>

        <div className="prd-section user-story-section">
          <h4 className="prd-section-title">User Story</h4>
          <blockquote className="prd-user-story-quote">
            {prd.userStory || 'As a user, I want features to work properly so that I can accomplish my goals.'}
          </blockquote>
        </div>

        <div className="prd-section acceptance-criteria-section">
          <h4 className="prd-section-title">Acceptance Criteria</h4>
          <ul className="prd-criteria-list">
            {criteriaList.map((criterion, index) => (
              <li key={index} className="prd-criteria-item">
                {criterion}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
