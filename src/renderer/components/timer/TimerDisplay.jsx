// Timer Display Component
import React from 'react';

const TimerDisplay = ({ pomodoroTimer }) => {
  return (
    <div className="timer-progress-ring">
      <svg width="280" height="280" viewBox="0 0 280 280">
        <circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="8"
        />
        <circle
          cx="140"
          cy="140"
          r="120"
          fill="none"
          stroke={pomodoroTimer.isBreak ? "#4CAF50" : "#ff6b35"}
          strokeWidth="8"
          strokeDasharray={`${2 * Math.PI * 120}`}
          strokeDashoffset={`${2 * Math.PI * 120 * (1 - pomodoroTimer.getProgress() / 100)}`}
          strokeLinecap="round"
          transform="rotate(-90 140 140)"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="timer-display-container">
        <h1 className="timer-display">{pomodoroTimer.formatTime()}</h1>
        <p className="timer-percentage">{Math.round(pomodoroTimer.getProgress())}%</p>
      </div>
    </div>
  );
};

export default TimerDisplay;
