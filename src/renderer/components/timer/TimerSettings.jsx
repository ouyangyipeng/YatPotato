// Timer Settings Component
import React from 'react';

const TimerSettings = ({
  isSettingsOpen,
  setIsSettingsOpen,
  customTimerLength,
  setCustomTimerLength,
  applyCustomTime
}) => {
  if (!isSettingsOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <h2>番茄钟设置</h2>
        <div className="settings-group">
          <label>专注时长</label>
          <div className="settings-control">
            <input 
              type="number" 
              min="1" 
              max="90" 
              value={customTimerLength} 
              onChange={(e) => setCustomTimerLength(parseInt(e.target.value))} 
            />
            <span>分钟</span>
          </div>
        </div>
        <div className="settings-info">
          <p>💡 经典番茄工作法建议25分钟专注，5分钟休息</p>
          <p>🔔 应用会在开始和结束时播放提示音</p>
          <p>📱 支持桌面通知提醒</p>
        </div>
        <div className="settings-buttons">
          <button onClick={() => setIsSettingsOpen(false)}>取消</button>
          <button onClick={applyCustomTime}>确定</button>
        </div>
      </div>
    </div>
  );
};

export default TimerSettings;
