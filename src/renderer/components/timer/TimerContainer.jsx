// Timer Container Component
import React from 'react';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import TimerStats from './TimerStats';
import TimerSettings from './TimerSettings';

const TimerContainer = ({
  pomodoroTimer,
  pomodoroStats,
  isSettingsOpen,
  setIsSettingsOpen,
  customTimerLength,
  setCustomTimerLength,
  applyCustomTime
}) => {
  return (
    <div className="timer-screen">
      <div className="timer-container">
        {/* 添加当前阶段指示器 */}
        <div className="phase-indicator">
          <span className={`phase-badge ${pomodoroTimer.isBreak ? 'break' : 'focus'}`}>
            {pomodoroTimer.getCurrentPhase()}
          </span>
          <span className="pomodoro-count">第 {pomodoroTimer.pomodoroCount + (pomodoroTimer.isBreak ? 0 : 1)} 个番茄钟</span>
        </div>

        <TimerDisplay pomodoroTimer={pomodoroTimer} />

        <p className="motivational-quote">
          {pomodoroTimer.isBreak 
            ? "适当休息，才能更好地专注。" 
            : "集中注意力，全神贯注，是专注力的表现。"}
        </p>
        
        <TimerControls 
          pomodoroTimer={pomodoroTimer}
          setIsSettingsOpen={setIsSettingsOpen}
        />

        <TimerStats pomodoroStats={pomodoroStats} />
      </div>

      <TimerSettings
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        customTimerLength={customTimerLength}
        setCustomTimerLength={setCustomTimerLength}
        applyCustomTime={applyCustomTime}
      />
    </div>
  );
};

export default TimerContainer;
