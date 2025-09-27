import React, { useState } from "react";
import ResumeUploader from "../components/Interviewee/ResumeUploader";

const IntervieweePage = () => {
  const [candidate, setCandidate] = useState(null);

  return (
    <div className="p-4">
      {!candidate && (
        <ResumeUploader onSubmit={(fields) => setCandidate(fields)} />
      )}
      {candidate && (
        <div>
          <h2>Welcome, {candidate.name}</h2>
          {/* Render ChatShell or Interview UI */}
        </div>
      )}
    </div>
  );
};

export default IntervieweePage;
