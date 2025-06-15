import { useState, useEffect, useRef } from 'react';

const usePomodoroTimer = ({
  initialMinutes = 25,
  onTimerStart,
  onTimerComplete,
  onTimerReset,
  customTimerLength,
  onTimerStateChange
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const intervalRef = useRef(null);
  const startSoundRef = useRef(null);
  const endSoundRef = useRef(null);
  const tickSoundRef = useRef(null);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  useEffect(() => {
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

    const createEndSound = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      return () => {
        const frequencies = [523, 659, 784];
        frequencies.forEach((freq, index) => {
          setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
          }, index * 400);
        });
      };
    };

    const createTickSound = () => () => {};

    startSoundRef.current = createStartSound();
    endSoundRef.current = createEndSound();
    tickSoundRef.current = createTickSound();
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev === 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setPomodoroCount(prev => prev + 1);
            setIsBreak(!isBreak);
            endSoundRef.current && endSoundRef.current();
            onTimerComplete && onTimerComplete();
            return customTimerLength ? customTimerLength * 60 : initialMinutes * 60;
          }
          tickSoundRef.current && tickSoundRef.current();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const startTimer = () => {
    setIsRunning(true);
    onTimerStart && onTimerStart();
    onTimerStateChange && onTimerStateChange(true);
    startSoundRef.current && startSoundRef.current();
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    onTimerStateChange && onTimerStateChange(false);
  };

  const resetTimer = () => {
    stopTimer();
    setTotalSeconds(initialMinutes * 60);
    setPomodoroCount(0);
    setIsBreak(false);
    onTimerReset && onTimerReset();
  };

  return {
    totalSeconds, minutes, seconds, isRunning, isBreak, pomodoroCount,
    startTimer, stopTimer, resetTimer,
    audioRefs: { startSoundRef, endSoundRef, tickSoundRef }
  };
};

export default usePomodoroTimer;
