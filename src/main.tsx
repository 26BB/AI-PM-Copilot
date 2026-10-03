import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ComplaintForm } from './components/ComplaintForm';
import { PrdSkeletonDisplay } from './components/PrdSkeletonDisplay';

function App() {
  const [submittedComplaint, setSubmittedComplaint] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>AI-PM Copilot</h1>
      <h2>Submit Raw User Complaint</h2>
      <ComplaintForm
        onSubmit={(complaint) => {
          setSubmittedComplaint(complaint);
        }}
      />
      {submittedComplaint && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ padding: '10px', background: '#e6fffa', border: '1px solid #319795', marginBottom: '20px' }}>
            <strong>Submitted:</strong> {submittedComplaint}
          </div>
          <PrdSkeletonDisplay
            prd={{
              problemStatement: submittedComplaint,
              userPersona: 'Impacted End User',
              userStory: `As a user, I want resolution for "${submittedComplaint}" so that I can proceed seamlessly.`,
              acceptanceCriteria: [
                'System validates feedback input.',
                'Issue is processed and structured into actionable PM artifacts.',
              ],
            }}
          />
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
