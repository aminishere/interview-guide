import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { submitAnswer, startQuestion, startInterview, resetSession } from "../../store/slices/sessionsSlice";
import Button from "../common/Button";
import Input from "../common/Input";

const ChatShell = ({ timeLimitSec = 60, onInterviewComplete, questions: propQuestions, currentIndex: propCurrentIndex }) => {
  const dispatch = useDispatch();
  const storeQuestions = useSelector(state => state.sessions.questions);
  const storeCurrentIndex = useSelector(state => state.sessions.currentQuestion);
  
  // Default questions if none are provided
  const defaultQuestions = [
    { id: 1, text: "Tell me about yourself and your background.", category: "General" },
    { id: 2, text: "What are your greatest strengths and how do they apply to this role?", category: "General" },
    { id: 3, text: "Describe a challenging project you worked on and how you overcame obstacles.", category: "Behavioral" },
    { id: 4, text: "Where do you see yourself in 5 years?", category: "Career Goals" },
    { id: 5, text: "Do you have any questions for us about the role or company?", category: "General" },
  ];
  
  // Use props if provided, otherwise fall back to store, otherwise use defaults
  const questions = propQuestions || storeQuestions || defaultQuestions;
  const currentIndex = propCurrentIndex !== undefined ? propCurrentIndex : storeCurrentIndex;
  const currentQuestion = questions[currentIndex];

  // Initialize questions in store if they don't exist or if current index is invalid
  useEffect(() => {
    if (!hasInitializedRef.current && ((!storeQuestions || storeQuestions.length === 0) || storeCurrentIndex >= (storeQuestions?.length || 0))) {
      hasInitializedRef.current = true;
      dispatch(startInterview({ questions: defaultQuestions }));
    }
  }, [dispatch, storeQuestions?.length, storeCurrentIndex]);



  const [answer, setAnswer] = useState("");
  const hasInitializedRef = useRef(false);

  // Auto-submit logic
  useEffect(() => {
    if (!currentQuestion) return;
    if (!currentQuestion.startTs) {
      dispatch(startQuestion(currentIndex));
    }

    const elapsed = (Date.now() - (currentQuestion.startTs || 0)) + (currentQuestion.elapsedBeforePauseMs || 0);
    const remaining = Math.max(timeLimitSec * 1000 - elapsed, 0);

    if (remaining <= 0) {
      dispatch(submitAnswer({ answer: "", autoSubmit: true }));
      setAnswer("");
      return;
    }

    const timeout = setTimeout(() => {
      dispatch(submitAnswer({ answer, autoSubmit: true }));
      setAnswer("");
    }, remaining);

    return () => clearTimeout(timeout);
  }, [currentIndex, timeLimitSec, dispatch, currentQuestion?.startTs, currentQuestion?.elapsedBeforePauseMs]);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="text-gray-600">Preparing interview questions...</div>
      </div>
    );
  }

  // Handle completion - only show when we've actually gone through all questions
  if (currentIndex >= questions.length && questions.length > 0) {
    // Call completion callback if provided
    if (onInterviewComplete) {
      onInterviewComplete();
    }
    return (
      <div className="p-4 text-center">
        <div className="text-green-600 text-lg font-semibold mb-2">🎉 Interview Completed!</div>
        <div className="text-gray-600">Thank you for your time. Your responses have been recorded.</div>
      </div>
    );
  }

  // Handle invalid state - show restart option
  if (currentIndex >= questions.length && questions.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-600 text-lg font-semibold mb-2">Interview Error</div>
        <div className="text-gray-600 mb-4">The interview session has an invalid state.</div>
        <button 
          onClick={() => {
            dispatch(resetSession());
            dispatch(startInterview({ questions: defaultQuestions }));
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Restart Interview
        </button>
      </div>
    );
  }

  const handleSubmit = () => {
    dispatch(submitAnswer({ answer }));
    setAnswer("");
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <strong>Question {currentIndex + 1}/{questions.length}:</strong>
        <p>{currentQuestion.text}</p>
      </div>
      <Input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer..."
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default ChatShell;
