// Achievements Grid Component
import React from 'react';

const AchievementsGrid = ({
  pomodoroStats,
  hasSevenConsecutivePomodoros,
  count_pomodoros,
  dataStorage
}) => {
  return (
    <>
      <h2 className="achievements-title">我的成就</h2>
      <div className="achievements-grid">
        <div className={`achievement-item ${pomodoroStats.totalPomodoros >= 1 ? 'unlocked' : ''}`}>
          <div className="achievement-icon">🔥</div>
          <div className="achievement-info">
            <h3>初学者</h3>
            <p>完成第一个番茄钟</p>
          </div>
        </div>
        <div className={`achievement-item ${pomodoroStats.todayPomodoros >= 5 ? 'unlocked' : ''}`}>
          <div className="achievement-icon">⚡</div>
          <div className="achievement-info">
            <h3>高效达人</h3>
            <p>一天内完成5个番茄钟</p>
          </div>
        </div>
        <div className={`achievement-item ${hasSevenConsecutivePomodoros() ? 'unlocked' : ''}`}>
          <div className="achievement-icon">🏆</div>
          <div className="achievement-info">
            <h3>持之以恒</h3>
            <p>连续7天使用YatPotato</p>
          </div>
        </div>
        <div className={`achievement-item ${pomodoroStats.totalPomodoros >= 20 ? 'unlocked' : ''}`}>
          <div className="achievement-icon">🌟</div>
          <div className="achievement-info">
            <h3>番茄大师</h3>
            <p>完成20个番茄钟</p>
          </div>
        </div>
        <div className={`achievement-item ${pomodoroStats.totalFocusTime >= 6000 ? 'unlocked' : ''}`}>
          <div className="achievement-icon">💎</div>
          <div className="achievement-info">
            <h3>专注王者</h3>
            <p>累计专注时长超过100小时</p>
          </div>
        </div>
        <div className="achievement-item">
          <div className="achievement-icon">🚀</div>
          <div className="achievement-info">
            <h3>效率狂人</h3>
            <p>单周完成30个番茄钟</p>
          </div>
        </div>
        <div className="consecutive-days-info">
          <h3>📅 累计使用统计</h3>
          <p>当前累计使用天数: <strong>{count_pomodoros(dataStorage.load("pomodoro_stats"))}</strong> 天</p>
        </div>
      </div>
    </>
  );
};

export default AchievementsGrid;
