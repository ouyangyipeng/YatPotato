import React, { useState, useEffect, useRef } from 'react';

const PomodoroTimer = ({
  initialMinutes = 25,
  onTimerStart,
  onTimerComplete,
  onTimerReset,
  customTimerLength,
  onTimerStateChange
}) => {
  // 使用总秒数来统一管理时间
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  
  // 音效引用
  const startSoundRef = useRef(null);
  const endSoundRef = useRef(null);
  const tickSoundRef = useRef(null);
  
  // 计时器引用
  const intervalRef = useRef(null);

  // 从总秒数计算分钟和秒钟
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // 创建音效
  useEffect(() => {
    // 创建开始音效 - 使用Web Audio API生成
    const createStartSound = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      return () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      };
    };

    // 创建结束音效 - 三声提示音
    const createEndSound = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      return () => {
        const frequencies = [523, 659, 784]; // C, E, G 和弦
        frequencies.forEach((freq, index) => {
          setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
          }, index * 200);
        });
      };
    };

    // 创建滴答音效
    const createTickSound = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      return () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      };
    };

    startSoundRef.current = createStartSound();
    endSoundRef.current = createEndSound();
    tickSoundRef.current = createTickSound();
  }, []);

  // 播放音效的辅助函数
  const playStartSound = () => {
    try {
      if (startSoundRef.current) {
        startSoundRef.current();
      }
    } catch (error) {
      console.log('音效播放失败:', error);
    }
  };

  const playEndSound = () => {
    try {
      if (endSoundRef.current) {
        endSoundRef.current();
      }
    } catch (error) {
      console.log('音效播放失败:', error);
    }
  };

  const playTickSound = () => {
    try {
      if (tickSoundRef.current) {
        tickSoundRef.current();
      }
    } catch (error) {
      console.log('音效播放失败:', error);
    }
  };

  // 计时器核心逻辑 - 统一使用总秒数管理
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prevTotalSeconds => {
          const newTotalSeconds = prevTotalSeconds - 1;
          
          // 最后10秒播放滴答声
          if (newTotalSeconds <= 10 && newTotalSeconds > 0) {
            playTickSound();
          }
          
          // 时间到了
          if (newTotalSeconds <= 0) {
            handleTimerComplete();
            return 0;
          }
          
          return newTotalSeconds;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // 处理计时器完成
  const handleTimerComplete = () => {
    setIsRunning(false);
    playEndSound();
    
    if (!isBreak) {
      // 番茄钟完成
      setPomodoroCount(prev => prev + 1);
      const newCount = pomodoroCount + 1;
      
      // 显示完成通知
      if (window.Notification && Notification.permission === "granted") {
        new Notification("番茄钟完成！", {
          body: `恭喜！您已完成第${newCount}个番茄钟。是时候休息一下了！`,
          icon: "/favicon.ico"
        });
      }
      
      // 自动开始休息
      if (newCount % 4 === 0) {
        // 每4个番茄钟后长休息(15分钟)
        setTotalSeconds(15 * 60);
        alert(`恭喜完成第${newCount}个番茄钟！\n现在开始15分钟长休息 🎉`);
      } else {
        // 短休息(5分钟)
        setTotalSeconds(5 * 60);
        alert(`恭喜完成第${newCount}个番茄钟！\n现在开始5分钟休息 ☕`);
      }
      setIsBreak(true);
    } else {
      // 休息完成
      if (window.Notification && Notification.permission === "granted") {
        new Notification("休息结束！", {
          body: "休息时间结束，准备开始新的番茄钟！",
          icon: "/favicon.ico"
        });
      }
      
      setTotalSeconds((customTimerLength || 25) * 60);
      setIsBreak(false);
      alert("休息结束！准备开始新的番茄钟 🍅");
    }
    
    // 回调函数通知父组件
    if (onTimerComplete) {
      onTimerComplete(isBreak, pomodoroCount + (isBreak ? 0 : 1));
    }
  };

  // 开始/暂停计时器
  const toggleTimer = () => {
    if (!isRunning) {
      playStartSound();
      if (onTimerStart) {
        onTimerStart(isBreak);
      }
    }
    
    setIsRunning(!isRunning);
    
    if (onTimerStateChange) {
      onTimerStateChange(!isRunning, minutes, seconds);
    }
  };

  // 重置计时器
  const resetTimer = () => {
    setIsRunning(false);
    setTotalSeconds((customTimerLength || initialMinutes) * 60);
    setIsBreak(false);
    
    if (onTimerReset) {
      onTimerReset();
    }
    
    if (onTimerStateChange) {
      const resetMinutes = customTimerLength || initialMinutes;
      onTimerStateChange(false, resetMinutes, 0);
    }
  };

  // 跳过当前阶段
  const skipPhase = () => {
    handleTimerComplete();
  };

  // 格式化时间显示
  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算进度百分比
  const getProgress = () => {
    const totalTargetSeconds = (customTimerLength || initialMinutes) * 60;
    const elapsedSeconds = totalTargetSeconds - totalSeconds;
    return (elapsedSeconds / totalTargetSeconds) * 100;
  };

  // 请求通知权限
  useEffect(() => {
    if (window.Notification && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return {
    minutes,
    seconds,
    isRunning,
    isBreak,
    pomodoroCount,
    toggleTimer,
    resetTimer,
    skipPhase,
    formatTime: () => formatTime(minutes, seconds),
    getProgress,
    getCurrentPhase: () => isBreak ? '休息时间' : '专注时间'
  };
};

export default PomodoroTimer; 