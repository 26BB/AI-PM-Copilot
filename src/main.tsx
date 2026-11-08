import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ComplaintForm } from './components/ComplaintForm';
import { SourceTag } from './components/SourceTagSelector';
import { PrdSkeletonDisplay } from './components/PrdSkeletonDisplay';
import { RiceScoreDisplay } from './components/RiceScoreDisplay';
import { AbTestDisplay } from './components/AbTestDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { generateProductArtifacts, AnalysisResult } from './services/geminiService';

export function App(): React.JSX.Element {
  const [complaintText, setComplaintText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedSourceTag, setSelectedSourceTag] = useState<string>('App Store');

  const handleGenerateArtifacts = async (complaint: string, sourceTag?: string): Promise<void> => {
    setComplaintText(complaint);
    const activeTag = sourceTag || selectedSourceTag;
    if (sourceTag) {
      setSelectedSourceTag(sourceTag);
    }
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateProductArtifacts(complaint, activeTag);
      setAnalysisResult(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate PRD artifacts from Gemini API.';
      setError(message);
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = (): void => {
    if (complaintText) {
      // WHY: Preserve the chosen feedback source context channel across retries
      void handleGenerateArtifacts(complaintText, selectedSourceTag);
    }
  };

  return (
    <div
      className="app-container"
      style={{
        maxWidth: '720px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <header className="app-header">
        <h1 className="app-title">AI-PM Copilot</h1>
        <p className="app-subtitle">
          Paste a raw user complaint to generate a PRD skeleton, RICE priority score, and A/B test suggestion in seconds.
        </p>
      </header>

      <main className="app-main">
        <ComplaintForm
          onSubmit={handleGenerateArtifacts}
          isLoading={isLoading}
          initialSourceTag={selectedSourceTag as SourceTag}
        />

        {isLoading && (
          <LoadingSpinner message="Analyzing complaint with Gemini AI to generate PRD skeleton, RICE score, & A/B test..." />
        )}

        {error && !isLoading && (
          <ErrorMessage error={error} onRetry={complaintText ? handleRetry : undefined} />
        )}

        {!isLoading && analysisResult && (
          <div
            className="analysis-results-container"
            role="region"
            aria-label="Generated PRD Analysis Results"
            style={{ marginTop: '24px' }}
          >
            <div
              className="submitted-context-banner"
            >
              <div className="context-row">
                <strong>Source Channel:</strong> {selectedSourceTag}
              </div>
              <div className="context-row">
                <strong>Submitted Complaint:</strong> {complaintText}
              </div>
            </div>
            <PrdSkeletonDisplay prd={analysisResult.prdSkeleton} />
            <RiceScoreDisplay riceScore={analysisResult.riceScore} />
            <AbTestDisplay abTest={analysisResult.abTestSuggestion} />
          </div>
        )}
      </main>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
