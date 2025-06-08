// Timer Controls Component
import React from 'react';

const TimerControls = ({ pomodoroTimer, setIsSettingsOpen }) => {
  return (
    <div className="timer-controls">
      <button 
        className={`control-btn ${pomodoroTimer.isRunning ? 'pause' : 'start'}`} 
        onClick={pomodoroTimer.toggleTimer}
      >
        {pomodoroTimer.isRunning ? '⏸️ 暂停' : '▶️ 开始'}
      </button>
      <button 
        className="control-btn reset" 
        onClick={pomodoroTimer.resetTimer}
      >
        🔄 重置
      </button>
      <button 
        className="control-btn skip" 
        onClick={pomodoroTimer.skipPhase}
        disabled={!pomodoroTimer.isRunning}
      >
        ⏭️ 跳过
      </button>
      <button 
        className="control-btn settings" 
        onClick={() => setIsSettingsOpen(true)}
      >
        ⚙️ 设置
      </button>
    </div>
  );
};

export default TimerControls;
