// Timer Stats Component
import React from 'react';

const TimerStats = ({ pomodoroStats }) => {
  return (
    <div className="daily-stats">
      <div className="stat-item">
        <span className="stat-number">{pomodoroStats.todayPomodoros}</span>
        <span className="stat-label">今日番茄钟</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{pomodoroStats.totalFocusTime}</span>
        <span className="stat-label">总专注时长(分钟)</span>
      </div>
    </div>
  );
};

export default TimerStats;
