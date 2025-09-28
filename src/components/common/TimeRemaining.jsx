import React, { useState, useEffect } from 'react';

const TimeRemaining = ({ startTime, timeLimitSec, elapsedBeforePauseMs = 0, paused = false }) => {
  const [remainingTime, setRemainingTime] = useState(timeLimitSec);

  useEffect(() => {
    const calculateRemaining = () => {
      if (paused || !startTime) {
        const elapsed = elapsedBeforePauseMs;
        const remaining = Math.max(timeLimitSec * 1000 - elapsed, 0);
        return Math.ceil(remaining / 1000);
      }
      const elapsed = (Date.now() - startTime) + elapsedBeforePauseMs;
      const remaining = Math.max(timeLimitSec * 1000 - elapsed, 0);
      return Math.ceil(remaining / 1000);
    };

    setRemainingTime(calculateRemaining());

    if (paused) return;

    const interval = setInterval(() => {
      setRemainingTime(calculateRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, timeLimitSec, elapsedBeforePauseMs, paused]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="text-sm font-mono text-gray-500">
      Time Remaining: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

export default TimeRemaining;