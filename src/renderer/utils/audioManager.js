/**
 * 音频管理器 - 处理番茄钟音效播放
 */
class AudioManager {
  constructor() {
    this.sounds = {};
    this.isEnabled = true;
    this.volume = 0.7;
    
    // 初始化音频文件
    this.initializeSounds();
  }

  /**
   * 初始化音频文件
   */
  initializeSounds() {
    try {
      // 番茄钟开始音效 - 使用 Web Audio API 生成
      this.sounds.start = this.createStartSound();
      // 番茄钟结束音效 - 使用 Web Audio API 生成
      this.sounds.finish = this.createFinishSound();
      // 滴答声音效
      this.sounds.tick = this.createTickSound();
    } catch (error) {
      console.warn('音频初始化失败:', error);
    }
  }

  /**
   * 创建开始音效 - 上升的音调，给人积极的感觉
   */
  createStartSound() {
    return () => {
      if (!this.isEnabled) return;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // 设置音频参数 - 上升音调
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      
      oscillator.type = 'sine';
      
      // 音量控制
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };
  }

  /**
   * 创建结束音效 - 愉悦的完成提示音
   */
  createFinishSound() {
    return () => {
      if (!this.isEnabled) return;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // 创建一个更复杂的完成音效
      const playNote = (frequency, startTime, duration) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      // 播放成功完成的音序：C-E-G-C
      const now = audioContext.currentTime;
      playNote(523.25, now, 0.15);        // C5
      playNote(659.25, now + 0.1, 0.15);  // E5
      playNote(783.99, now + 0.2, 0.15);  // G5
      playNote(1046.50, now + 0.3, 0.3);  // C6
    };
  }

  /**
   * 创建滴答声音效 - 轻微的滴答声
   */
  createTickSound() {
    return () => {
      if (!this.isEnabled) return;
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    };
  }

  /**
   * 播放开始音效
   */
  playStartSound() {
    try {
      if (this.sounds.start) {
        this.sounds.start();
        console.log('播放番茄钟开始音效');
      }
    } catch (error) {
      console.warn('播放开始音效失败:', error);
    }
  }

  /**
   * 播放结束音效
   */
  playFinishSound() {
    try {
      if (this.sounds.finish) {
        this.sounds.finish();
        console.log('播放番茄钟完成音效');
      }
    } catch (error) {
      console.warn('播放结束音效失败:', error);
    }
  }

  /**
   * 播放滴答声
   */
  playTickSound() {
    try {
      if (this.sounds.tick) {
        this.sounds.tick();
      }
    } catch (error) {
      console.warn('播放滴答声失败:', error);
    }
  }

  /**
   * 设置音效开关
   */
  setSoundEnabled(enabled) {
    this.isEnabled = enabled;
    console.log(`音效已${enabled ? '开启' : '关闭'}`);
  }

  /**
   * 设置音量
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    console.log(`音量设置为: ${(this.volume * 100).toFixed(0)}%`);
  }

  /**
   * 获取音效状态
   */
  getSoundEnabled() {
    return this.isEnabled;
  }

  /**
   * 获取当前音量
   */
  getVolume() {
    return this.volume;
  }
}

// 创建全局实例
const audioManager = new AudioManager();

export default audioManager; 