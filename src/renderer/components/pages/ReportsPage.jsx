// Reports Page Component
import React from 'react';

const ReportsPage = ({ pomodoroStats }) => {
  return (
    <div className="reports-screen">
      <h2>专注报告</h2>
      <div className="report-tabs">
        <button className="report-tab active">周报</button>
        <button className="report-tab">月报</button>
      </div>
      <div className="report-content">
        <div className="report-summary">
          <div className="report-stat">
            <span className="stat-value">{pomodoroStats.totalPomodoros}</span>
            <span className="stat-label">完成番茄数</span>
          </div>
          <div className="report-stat">
            <span className="stat-value">{Math.round(pomodoroStats.totalFocusTime / 60)}h</span>
            <span className="stat-label">专注时长</span>
          </div>
          <div className="report-stat">
            <span className="stat-value">{pomodoroStats.todayPomodoros}</span>
            <span className="stat-label">今日番茄数</span>
          </div>
          <div className="report-stat">
            <span className="stat-label">打卡天数</span>
          </div>
        </div>
        <div className="report-chart">
          <h3>本周专注趋势</h3>
          <div className="chart-placeholder">
            <p>📈 图表功能开发中...</p>
          </div>
        </div>
        <div className="weekly-calendar">
          <div className="calendar-header">
            <span>一</span>
            <span>二</span>
            <span>三</span>
            <span>四</span>
            <span>五</span>
            <span>六</span>
            <span>日</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
