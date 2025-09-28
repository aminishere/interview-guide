import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { submitAnswer, startQuestion, resumeQuestion } from "../../store/slices/sessionsSlice";
import TimerBanner from "./TimerBanner";
import Button from "../common/Button";
import Input from "../common/Input";

const ChatShell = ({ timeLimitSec = 60, onInterviewComplete, questions: propQuestions, currentIndex: propCurrentIndex }) => {
  const dispatch = useDispatch();
  const storeQuestions = useSelector(state => state.sessions.questions);
  const storeCurrentIndex = useSelector(state => state.sessions.currentQuestion);
  
  // Use props if provided, otherwise fall back to store
  const questions = propQuestions || storeQuestions;
  const currentIndex = propCurrentIndex !== undefined ? propCurrentIndex : storeCurrentIndex;
  const currentQuestion = questions[currentIndex];

  console.log("ChatShell - questions:", questions);
  console.log("ChatShell - currentIndex:", currentIndex);
  console.log("ChatShell - currentQuestion:", currentQuestion);

  const [answer, setAnswer] = useState("");

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
        <div className="text-gray-600">Loading interview questions...</div>
      </div>
    );
  }

  if (!currentQuestion) {
    // Call completion callback if provided
    if (onInterviewComplete) {
      onInterviewComplete();
    }
    return <div>All questions completed!</div>;
  }

  const handleSubmit = () => {
    dispatch(submitAnswer({ answer }));
    setAnswer("");
  };

  return (
    <div className="p-4 space-y-4">
      <TimerBanner question={currentQuestion} timeLimitSec={timeLimitSec} />
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
