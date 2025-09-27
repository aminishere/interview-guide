import React, { useState } from "react";
import IntervieweePage from "./pages/IntervieweePage.jsx";
import InterviewerPage from "./pages/InterviewerPage.jsx";

export default function App() {
  const [tab, setTab] = useState("interviewee");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold">AI Interview Assistant</h1>
        <nav className="space-x-4">
          <button
            onClick={() => setTab("interviewee")}
            className={`px-3 py-1 rounded ${
              tab === "interviewee" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Interviewee
          </button>
          <button
            onClick={() => setTab("interviewer")}
            className={`px-3 py-1 rounded ${
              tab === "interviewer" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Interviewer
          </button>
        </nav>
      </header>

      <main className="flex-1 p-4 bg-white">
  {tab === "interviewee" ? <IntervieweePage /> : <InterviewerPage />}
</main>


    </div>
  );
}
