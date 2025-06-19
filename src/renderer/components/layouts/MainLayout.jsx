// Main Layout Component
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MainLayout = ({ children, toggleScreenLock }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/timer', icon: '⏱️', label: '计时器' },
    { path: '/tasks', icon: '📋', label: '任务' },
    { path: '/reports', icon: '📊', label: '报告' },
    { path: '/profile', icon: '👤', label: '个人主页' },
    { path: '/chat', icon: '💬', label: 'AI助手' }, // 添加的代码行
    { path: '/table', icon: '🗂️', label: '表格' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app">
      {/* Hot reload test area */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#ff6b35',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999
      }}>
      </div>

      <div className="content">
        {children}
      </div>
      
      <nav className="bottom-navigation">
        {navigationItems.map((item) => (
          <button 
            key={item.path}
            className={isActive(item.path) ? 'active' : ''}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
        <button onClick={toggleScreenLock}>
          🔒
          <span>锁机</span>
        </button>
      </nav>
    </div>
  );
};

export default MainLayout;
