import React from 'react';
import usePomodoroTimer from '../../hooks/usePomodoroTimer';

const PomodoroTimer = (props) => {
  const {
    totalSeconds, minutes, seconds, isRunning, isBreak, pomodoroCount,
    startTimer, stopTimer, resetTimer
  } = usePomodoroTimer(props);

  return (
    <div>
      <h2>{isBreak ? '休息中' : '专注中'}</h2>
      <div>{minutes}:{seconds.toString().padStart(2, '0')}</div>
      <button onClick={startTimer} disabled={isRunning}>开始</button>
      <button onClick={stopTimer} disabled={!isRunning}>暂停</button>
      <button onClick={resetTimer}>重置</button>
    </div>
  );
};

export default PomodoroTimer;
