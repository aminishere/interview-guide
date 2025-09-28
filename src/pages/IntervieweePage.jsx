import React, { useState } from "react";
import ResumeUploader from "../components/Interviewee/ResumeUploader";
import ChatShell from "../components/Interviewee/ChatShell";
import Button from "../components/common/Button";

const IntervieweePage = () => {
  const [candidate, setCandidate] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const handleResumeSubmit = (fields) => setCandidate(fields);

  const startInterviewSession = () => {
    setInterviewStarted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!candidate && (
        <div className="container mx-auto px-4 py-8">
          <ResumeUploader onSubmit={handleResumeSubmit} />
        </div>
      )}

      {candidate && !interviewStarted && (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome, {candidate.name}!
            </h2>
            <p className="text-gray-600 mb-6">
              Your resume has been processed. Ready to start your interview?
            </p>
            <Button
              onClick={startInterviewSession}
              disabled={!candidate.name?.trim() || !candidate.email?.trim() || !candidate.phone?.trim()}
            >
              Start Interview
            </Button>
          </div>
        </div>
      )}

      {candidate && interviewStarted && (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome, {candidate.name}!
              </h2>
              <p className="text-gray-600">
                Your interview has started. You have 2 minutes per question.
              </p>
            </div>
            <ChatShell timeLimitSec={120} />
          </div>
        </div>
      )}
    </div>
  );
};

export default IntervieweePage;
