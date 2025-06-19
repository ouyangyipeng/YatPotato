// Achievements Grid Component
import React from 'react';

const AchievementsGrid = ({
  pomodoroStats,
  hasSevenConsecutivePomodoros,
  count_pomodoros,
  dataStorage
}) => {
  // 获取当前日期字符串 (YYYY-M-D)
  const getCurrentDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  };

  // 获取当前周字符串 (YYYY-WW)
  const getCurrentWeekString = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - startDate) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startDate.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
  };

  // 计算今日完成的番茄钟数量
  const getTodayPomodoroCount = () => {
    const today = getCurrentDateString();
    return pomodoroStats.dailyStats[today]?.count || 0;
  };

  // 计算本周完成的番茄钟数量
  const getThisWeekPomodoroCount = () => {
    const thisWeek = getCurrentWeekString();
    return pomodoroStats.weeklyStats[thisWeek]?.count || 0;
  };

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
        <div className={`achievement-item ${getTodayPomodoroCount() >= 5 ? 'unlocked' : ''}`}>
          <div className="achievement-icon">⚡</div>
          <div className="achievement-info">
            <h3>高效达人</h3>
            <p>一天内完成5个番茄钟 ({getTodayPomodoroCount()}/5)</p>
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
        <div className={`achievement-item ${getThisWeekPomodoroCount() >= 30 ? 'unlocked' : ''}`}>
          <div className="achievement-icon">🚀</div>
          <div className="achievement-info">
            <h3>效率狂人</h3>
            <p>单周完成30个番茄钟 ({getThisWeekPomodoroCount()}/30)</p>
          </div>
        </div>
        <div className="consecutive-days-info">
          <h3>📅 累计使用统计</h3>
          <p>当前累计使用天数: <strong>{count_pomodoros(dataStorage.load("pomodoro_stats") || pomodoroStats)}</strong> 天</p>
          <p>本周番茄钟数: <strong>{getThisWeekPomodoroCount()}</strong> 个</p>
          <p>今日番茄钟数: <strong>{getTodayPomodoroCount()}</strong> 个</p>
        </div>
      </div>
    </>
  );
};

export default AchievementsGrid;
