import React, { useEffect, useState } from "react";

const TimerBanner = ({ question, timeLimitSec }) => {
  const [remaining, setRemaining] = useState(timeLimitSec * 1000);

  useEffect(() => {
    if (!question.startTs) return;

    const computeRemaining = () => {
      const elapsed = (Date.now() - question.startTs) + (question.elapsedBeforePauseMs || 0);
      return Math.max(timeLimitSec * 1000 - elapsed, 0);
    };

    setRemaining(computeRemaining());

    const interval = setInterval(() => {
      const rem = computeRemaining();
      setRemaining(rem);
      if (rem <= 0) clearInterval(interval);
    }, 200); // update 5x per second

    return () => clearInterval(interval);
  }, [question]);

  const progress = ((timeLimitSec * 1000 - remaining) / (timeLimitSec * 1000)) * 100;

  return (
    <div className="p-2 bg-gray-100 flex justify-between items-center">
      <div>Time remaining: {Math.ceil(remaining / 1000)}s</div>
      <div className="bg-gray-300 w-1/2 h-2 rounded">
        <div className="bg-blue-600 h-2 rounded" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default TimerBanner;
