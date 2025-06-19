// Pomodoro Completion Modal Component
import React from 'react';

const PomodoroModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  icon = "🍅", 
  type = "success",
  buttonText = "继续",
  showCloseButton = true,
  autoClose = false,
  autoCloseDelay = 3000
}) => {
  // 自动关闭功能
  React.useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const modalTypeClass = type === 'break' ? 'pomodoro-modal-break' : 'pomodoro-modal-success';

  return (
    <div className="pomodoro-modal-overlay" onClick={onClose}>
      <div className={`pomodoro-modal ${modalTypeClass}`} onClick={(e) => e.stopPropagation()}>
        {showCloseButton && (
          <button className="pomodoro-modal-close" onClick={onClose}>×</button>
        )}
        
        <div className="pomodoro-modal-icon">
          {icon}
        </div>
        
        <h2 className="pomodoro-modal-title">{title}</h2>
        
        <p className="pomodoro-modal-message">{message}</p>
        
        <button className="pomodoro-modal-button" onClick={onClose}>
          {buttonText}
        </button>
        
        {autoClose && (
          <div className="pomodoro-modal-progress">
            <div className="pomodoro-modal-progress-bar" 
                 style={{ animationDuration: `${autoCloseDelay}ms` }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PomodoroModal;
