import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ResumeUploader from "../components/Interviewee/ResumeUploader";
import ChatShell from "../components/Interviewee/ChatShell";
import { startInterview } from "../store/slices/sessionsSlice";

const IntervieweePage = () => {
  const [candidate, setCandidate] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const dispatch = useDispatch();

  const sampleQuestions = [
    { id: 1, text: "Tell me about yourself and your background.", category: "General" },
    { id: 2, text: "What are your greatest strengths and how do they apply to this role?", category: "General" },
    { id: 3, text: "Describe a challenging project you worked on and how you overcame obstacles.", category: "Behavioral" },
    { id: 4, text: "Where do you see yourself in 5 years?", category: "Career Goals" },
    { id: 5, text: "Do you have any questions for us about the role or company?", category: "General" },
  ];

  const handleResumeSubmit = (fields) => setCandidate(fields);

  const startInterviewSession = () => {
    dispatch(startInterview({ questions: sampleQuestions }));
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
            <button
              onClick={startInterviewSession}
              disabled={!candidate.name?.trim() || !candidate.email?.trim() || !candidate.phone?.trim()}
              className={`px-8 py-3 rounded-lg font-semibold shadow-lg transition-colors ${
                !candidate.name || !candidate.email || !candidate.phone
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Start Interview
            </button>
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
