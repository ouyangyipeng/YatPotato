// Lock Screen Component
import React from 'react';

const LockScreen = ({ toggleScreenLock, pomodoroTimer }) => {
  return (
    <div className="locked-screen">
      <div className="locked-content">
        <div className="lock-icon">🔒</div>
        <h2>专注模式已锁定</h2>
        <p className="timer-display">{pomodoroTimer.formatTime()}</p>
        <p className="lock-message">
          {pomodoroTimer.isBreak ? '休息进行中，放松一下' : '专注进行中，请勿打扰'}
        </p>
        <div className="lock-phase-indicator">
          <span className={`phase-badge ${pomodoroTimer.isBreak ? 'break' : 'focus'}`}>
            {pomodoroTimer.getCurrentPhase()}
          </span>
        </div>
        <button className="unlock-btn" onClick={toggleScreenLock}>解锁</button>
      </div>
    </div>
  );
};

export default LockScreen;
