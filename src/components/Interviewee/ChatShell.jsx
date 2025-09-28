import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { submitAnswer, startQuestion, startInterview, resetSession } from "../../store/slices/sessionsSlice";
import Button from "../common/Button";
import Input from "../common/Input";
import TimeRemaining from "../common/TimeRemaining";

const ChatShell = ({ timeLimitSec = 60, onInterviewComplete, questions: propQuestions, currentIndex: propCurrentIndex }) => {
  const dispatch = useDispatch();
  const { questions, currentQuestion: currentIndex, paused } = useSelector(state => state.sessions);
  const currentQuestion = questions[currentIndex];
  
  // Default questions if none are provided via props
  const defaultQuestions = [
    { id: 1, text: "Tell me about yourself and your background.", category: "General" },
    { id: 2, text: "What are your greatest strengths and how do they apply to this role?", category: "General" },
    { id: 3, text: "Describe a challenging project you worked on and how you overcame obstacles.", category: "Behavioral" },
    { id: 4, text: "Where do you see yourself in 5 years?", category: "Career Goals" },
    { id: 5, text: "Do you have any questions for us about the role or company?", category: "General" },
  ];
  
  // Initialize the interview session in the store once.
  useEffect(() => {
    // Use questions from props if available, otherwise use defaults.
    const questionsToStart = propQuestions || defaultQuestions;
    dispatch(startInterview({ questions: questionsToStart }));
    // Clean up session on component unmount
    return () => {
      dispatch(resetSession());
    };
  }, [dispatch, propQuestions]); // Reruns only if props change, which is unlikely.

  const [answer, setAnswer] = useState("");

  // Effect for question timer and auto-submission
  useEffect(() => {
    // Only run if there is a current question and the interview is not paused.
    if (!currentQuestion || paused) return;

    // Ensure the question timer starts if it hasn't already.
    if (currentQuestion.startTs === null) {
      dispatch(startQuestion(currentIndex));
    }

    // Calculate remaining time
    const elapsed = (Date.now() - currentQuestion.startTs) + currentQuestion.elapsedBeforePauseMs;
    const remaining = Math.max(timeLimitSec * 1000 - elapsed, 0);

    const timeout = setTimeout(() => {
      // Submit with current answer, or empty if user typed nothing.
      dispatch(submitAnswer({ answer, autoSubmit: true }));
      setAnswer("");
    }, remaining);

    return () => clearTimeout(timeout);
  }, [currentIndex, currentQuestion, paused, timeLimitSec, dispatch, answer]);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="text-gray-600">Preparing interview questions...</div>
      </div>
    );
  }

  // Handle interview completion
  if (currentIndex >= questions.length) {
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

  const handleSubmit = () => {
    dispatch(submitAnswer({ answer }));
    setAnswer("");
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <strong>Question {currentIndex + 1}/{questions.length}:</strong>
        <p>{currentQuestion.text}</p>
        <TimeRemaining
          startTime={currentQuestion.startTs}
          timeLimitSec={timeLimitSec}
          elapsedBeforePauseMs={currentQuestion.elapsedBeforePauseMs}
          paused={paused}
        />
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
