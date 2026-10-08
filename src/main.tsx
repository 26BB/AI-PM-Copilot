import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ComplaintForm } from './components/ComplaintForm';
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

  const handleGenerateArtifacts = async (complaint: string): Promise<void> => {
    setComplaintText(complaint);
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateProductArtifacts(complaint);
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
      void handleGenerateArtifacts(complaintText);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>AI-PM Copilot</h1>
      <h2>Submit Raw User Complaint</h2>
      <ComplaintForm onSubmit={handleGenerateArtifacts} isLoading={isLoading} />

      {isLoading && (
        <LoadingSpinner message="Analyzing complaint with Gemini AI to generate PRD skeleton, RICE score, & A/B test..." />
      )}

      {error && !isLoading && (
        <ErrorMessage error={error} onRetry={complaintText ? handleRetry : undefined} />
      )}

      {!isLoading && analysisResult && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ padding: '10px', background: '#e6fffa', border: '1px solid #319795', marginBottom: '20px', borderRadius: '4px' }}>
            <strong>Submitted Complaint:</strong> {complaintText}
          </div>
          <PrdSkeletonDisplay prd={analysisResult.prdSkeleton} />
          <RiceScoreDisplay riceScore={analysisResult.riceScore} />
          <AbTestDisplay abTest={analysisResult.abTestSuggestion} />
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
