// Reports Page Component
import React, { useState, useMemo } from 'react';

const ReportsPage = ({ pomodoroStats, getTodayPomodoroCount, getThisWeekPomodoroCount }) => {
  const [activeTab, setActiveTab] = useState('week');

  // 获取当前日期相关函数
  const getCurrentDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  };

  const getCurrentWeekString = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - startDate) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + startDate.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
  };

  // 计算统计数据
  const statsData = useMemo(() => {
    if (!pomodoroStats) return {
      totalPomodoros: 0,
      totalHours: 0,
      todayCount: 0,
      weekCount: 0,
      activedays: 0,
      avgPerDay: 0,
      bestDay: 0,
      streak: 0
    };

    const todayCount = getTodayPomodoroCount ? getTodayPomodoroCount(pomodoroStats) : 0;
    const weekCount = getThisWeekPomodoroCount ? getThisWeekPomodoroCount(pomodoroStats) : 0;
    const totalHours = Math.round((pomodoroStats.totalFocusTime || 0) / 60 * 10) / 10;
    const activeDays = Object.keys(pomodoroStats.dailyStats || {}).length;
    const avgPerDay = activeDays > 0 ? Math.round((pomodoroStats.totalPomodoros || 0) / activeDays * 10) / 10 : 0;
    
    // 计算最佳单日记录
    const bestDay = Math.max(0, ...Object.values(pomodoroStats.dailyStats || {}).map(day => day.count || 0));
    
    // 计算连续天数（简化版）
    const streak = activeDays; // 简化实现

    return {
      totalPomodoros: pomodoroStats.totalPomodoros || 0,
      totalHours,
      todayCount,
      weekCount,
      activeDays,
      avgPerDay,
      bestDay,
      streak
    };
  }, [pomodoroStats, getTodayPomodoroCount, getThisWeekPomodoroCount]);

  // 生成本周数据
  const weeklyData = useMemo(() => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // 周一

    return days.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      const count = pomodoroStats?.dailyStats?.[dateStr]?.count || 0;
      
      return {
        day,
        date: date.getDate(),
        count,
        isToday: dateStr === getCurrentDateString()
      };
    });
  }, [pomodoroStats]);

  // 生成月度热力图数据（简化版）
  const monthlyHeatmap = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    
    const weeks = [];
    let currentWeek = [];
    
    // 填充月初空白
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }
    
    // 填充日期
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month + 1}-${day}`;
      const count = pomodoroStats?.dailyStats?.[dateStr]?.count || 0;
      
      currentWeek.push({
        day,
        count,
        isToday: dateStr === getCurrentDateString()
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [pomodoroStats]);

  return (
    <div className="reports-screen">
      <div className="reports-header">
        <h2>📊 专注报告</h2>
        <div className="report-tabs">
          <button 
            className={`report-tab ${activeTab === 'week' ? 'active' : ''}`}
            onClick={() => setActiveTab('week')}
          >
            📅 周报
          </button>
          <button 
            className={`report-tab ${activeTab === 'month' ? 'active' : ''}`}
            onClick={() => setActiveTab('month')}
          >
            📆 月报
          </button>
        </div>
      </div>

      <div className="report-content">
        {/* 核心统计数据 */}
        <div className="report-summary">
          <div className="report-stat-card">
            <div className="stat-icon">🍅</div>
            <div className="stat-content">
              <span className="stat-value">{statsData.totalPomodoros}</span>
              <span className="stat-label">总番茄钟</span>
            </div>
          </div>
          <div className="report-stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <span className="stat-value">{statsData.totalHours}h</span>
              <span className="stat-label">专注时长</span>
            </div>
          </div>
          <div className="report-stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <span className="stat-value">{statsData.todayCount}</span>
              <span className="stat-label">今日番茄</span>
            </div>
          </div>
          <div className="report-stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <span className="stat-value">{statsData.avgPerDay}</span>
              <span className="stat-label">日均数量</span>
            </div>
          </div>
        </div>

        {activeTab === 'week' && (
          <>
            {/* 本周趋势图 */}
            <div className="chart-section">
              <h3>📊 本周专注趋势</h3>
              <div className="weekly-chart">
                {weeklyData.map((item, index) => (
                  <div key={index} className="chart-bar-container">
                    <div className="chart-bar-wrapper">
                      <div 
                        className={`chart-bar ${item.isToday ? 'today' : ''}`}
                        style={{ 
                          height: `${Math.max(20, (item.count / Math.max(1, Math.max(...weeklyData.map(d => d.count)))) * 120)}px` 
                        }}
                      >
                        {item.count > 0 && <span className="bar-value">{item.count}</span>}
                      </div>
                    </div>
                    <div className="chart-label">
                      <div className="day-name">{item.day}</div>
                      <div className="day-date">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 周度详情 */}
            <div className="detail-cards">
              <div className="detail-card">
                <h4>🏆 本周成就</h4>
                <div className="achievement-item">
                  <span>本周总数：</span>
                  <strong>{statsData.weekCount} 个番茄钟</strong>
                </div>
                <div className="achievement-item">
                  <span>最佳单日：</span>
                  <strong>{Math.max(...weeklyData.map(d => d.count))} 个</strong>
                </div>
                <div className="achievement-item">
                  <span>活跃天数：</span>
                  <strong>{weeklyData.filter(d => d.count > 0).length} 天</strong>
                </div>
              </div>
              <div className="detail-card">
                <h4>💡 效率分析</h4>
                <div className="efficiency-analysis">
                  {statsData.weekCount >= 20 && <div className="analysis-badge success">🌟 高效一周</div>}
                  {weeklyData.filter(d => d.count > 0).length >= 5 && <div className="analysis-badge success">📅 坚持打卡</div>}
                  {statsData.todayCount >= 5 && <div className="analysis-badge success">🔥 今日高产</div>}
                  {statsData.weekCount < 10 && <div className="analysis-badge warning">💪 可以更努力</div>}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'month' && (
          <>
            {/* 月度热力图 */}
            <div className="chart-section">
              <h3>🔥 本月专注热力图</h3>
              <div className="monthly-heatmap">
                <div className="heatmap-header">
                  <div className="weekday-labels">
                    <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span>
                  </div>
                </div>
                <div className="heatmap-grid">
                  {monthlyHeatmap.map((week, weekIndex) => (
                    <div key={weekIndex} className="heatmap-week">
                      {week.map((day, dayIndex) => (
                        <div 
                          key={dayIndex} 
                          className={`heatmap-day ${day ? 'has-data' : 'empty'} ${day?.isToday ? 'today' : ''}`}
                          data-count={day?.count || 0}
                          style={{
                            backgroundColor: day ? 
                              `rgba(255, 107, 53, ${Math.min(1, (day.count || 0) / 8)})` : 
                              'transparent'
                          }}
                        >
                          {day?.day}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="heatmap-legend">
                  <span>少</span>
                  <div className="legend-colors">
                    <div style={{backgroundColor: '#f0f0f0'}}></div>
                    <div style={{backgroundColor: 'rgba(255, 107, 53, 0.2)'}}></div>
                    <div style={{backgroundColor: 'rgba(255, 107, 53, 0.4)'}}></div>
                    <div style={{backgroundColor: 'rgba(255, 107, 53, 0.6)'}}></div>
                    <div style={{backgroundColor: 'rgba(255, 107, 53, 0.8)'}}></div>
                    <div style={{backgroundColor: 'rgba(255, 107, 53, 1)'}}></div>
                  </div>
                  <span>多</span>
                </div>
              </div>
            </div>

            {/* 月度统计 */}
            <div className="detail-cards">
              <div className="detail-card">
                <h4>📊 月度统计</h4>
                <div className="achievement-item">
                  <span>活跃天数：</span>
                  <strong>{statsData.activeDays} 天</strong>
                </div>
                <div className="achievement-item">
                  <span>最佳单日：</span>
                  <strong>{statsData.bestDay} 个番茄钟</strong>
                </div>
                <div className="achievement-item">
                  <span>日均产出：</span>
                  <strong>{statsData.avgPerDay} 个</strong>
                </div>
              </div>
              <div className="detail-card">
                <h4>🎯 目标达成</h4>
                <div className="goal-progress">
                  <div className="goal-item">
                    <span>本月目标: 100个番茄钟</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${Math.min(100, (statsData.totalPomodoros / 100) * 100)}%` }}
                      ></div>
                    </div>
                    <span>{Math.round((statsData.totalPomodoros / 100) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
