// YatPotato - 专注时光，高效番茄
import './App.css';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import PomodoroTimer from './components/PomodoroTimer';
import StringRef from './utils/stringRef';
import AppRouter from './components/common/AppRouter';

function App() {
  // 添加ref来管理输入框焦点
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  
  // 使用 useMemo 缓存 dataStorage 实例，避免无限重新创建
  const dataStorage = useMemo(() => {
    return window.DataStorage.loadDataStorage("ds-test");
  }, []);

  // 状态管理
  const [customTimerLength, setCustomTimerLength] = useState(25); // 自定义时长
  // 任务相关状态
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [menuOpenTaskId, setMenuOpenTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScreenLocked, setIsScreenLocked] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);  
  const [pomodoroStats, setPomodoroStats] = useState({
    totalPomodoros: 0,
    todayPomodoros: 0,
    totalFocusTime: 0,
    Pomodoros: [], // 存储番茄钟记录：{ date, timestamp, duration, dayOfYear }
    dailyStats: {}, // 按日期存储每日统计：{ "2025-6-19": { count: 5, focusTime: 125 } }
    weeklyStats: {} // 按周存储每周统计：{ "2025-W25": { count: 30, focusTime: 750 } }
  });

  // 登录相关状态
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // 注册相关状态
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  
  // 注册表单验证状态
  const [registerErrors, setRegisterErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // 新增：个人资料相关状态
  const [signature, setSignature] = useState('');
  const [isEditingSignature, setIsEditingSignature] = useState(false);
  const [tempSignature, setTempSignature] = useState('');
  const count_pomodoros = (stats) => {
    return stats.Pomodoros.length;
  }

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
  const getTodayPomodoroCount = (stats) => {
    const today = getCurrentDateString();
    return stats.dailyStats[today]?.count || 0;
  };

  // 计算本周完成的番茄钟数量
  const getThisWeekPomodoroCount = (stats) => {
    const thisWeek = getCurrentWeekString();
    return stats.weeklyStats[thisWeek]?.count || 0;
  };

  // 检查是否单周完成30个番茄钟
  const hasWeekly30Pomodoros = (stats) => {
    const thisWeek = getCurrentWeekString();
    return (stats.weeklyStats[thisWeek]?.count || 0) >= 30;
  };

  /**
   * 检查是否存在 7 天连续打卡
   * 直接从 dataStorage.load("pomodoro_stats") 读取 Pomodoros 列表
   * @returns {boolean}
   */
  function hasSevenConsecutivePomodoros() {
    // 读取存储的数据
    const stats = dataStorage.load("pomodoro_stats") || pomodoroStats;
    if (!stats || !stats.Pomodoros) return false;
    
    const list = stats.Pomodoros || [];

    // 转为数字数组 - 正确处理复杂的数据结构
    const days = list
      .map(item => {
        // 处理复杂的嵌套结构
        let value;
        if (item && item._value && item._value.obj) {
          // 直接从 _value.obj 获取字符串值
          value = item._value.obj;
        } else if (item && item._value) {
          // 如果是 StringRef 实例
          value = StringRef.isStringRef(item._value) 
            ? item._value.value() 
            : item._value;
        } else if (StringRef.isStringRef(item)) {
          // 如果 item 本身是 StringRef
          value = item.value();
        } else {
          // 其他情况，尝试转换
          value = StringRef.from(item).value();
        }
        
        return parseInt(value, 10);
      })
      .filter(day => !isNaN(day)) // 过滤掉无效值
      .sort((a, b) => a - b);

    console.log('处理后的天数数组:', days);

    // 滑动窗口判断是否有长度为 7 的等差序列（公差 = 1）
    for (let i = 0; i <= days.length - 7; i++) {
      let ok = true;
      for (let j = 1; j < 7; j++) {
        if (days[i + j] !== days[i] + j) {
          ok = false;
          break;
        }
      }
      if (ok) {
        console.log(`找到连续7天: ${days[i]} 到 ${days[i + 6]}`);
        return true;
      }
    }
    return false;
  }
  
  // 使用新的番茄钟组件
  const pomodoroTimer = PomodoroTimer({
    initialMinutes: customTimerLength,
    customTimerLength: customTimerLength,
    onTimerStart: (isBreak) => {
      console.log(isBreak ? '休息开始' : '专注时间开始');
    },    onTimerComplete: (isBreak, pomodoroCount) => {
      if (!isBreak) {
        // 更新番茄钟统计
        const now = new Date();
        const currentDate = getCurrentDateString();
        const currentWeek = getCurrentWeekString();
        const timestamp = now.getTime();

        setPomodoroStats(prev => {
          // 创建新的番茄钟记录
          const newPomodoroRecord = {
            date: currentDate,
            timestamp: timestamp,
            duration: customTimerLength,
            dayOfYear: Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
          };

          // 更新今日统计
          const todayStats = prev.dailyStats[currentDate] || { count: 0, focusTime: 0 };
          const newDailyStats = {
            ...prev.dailyStats,
            [currentDate]: {
              count: todayStats.count + 1,
              focusTime: todayStats.focusTime + customTimerLength
            }
          };

          // 更新本周统计
          const weekStats = prev.weeklyStats[currentWeek] || { count: 0, focusTime: 0 };
          const newWeeklyStats = {
            ...prev.weeklyStats,
            [currentWeek]: {
              count: weekStats.count + 1,
              focusTime: weekStats.focusTime + customTimerLength
            }
          };

          // 更新Pomodoros数组，保持兼容性
          const today = StringRef.today();
          const todayPomodoros = prev.Pomodoros;
          const nowPomodoro = () => {
            if (todayPomodoros.length === 0) {
              return [...todayPomodoros, today];
            } else {
              if (todayPomodoros[todayPomodoros.length - 1]._value === today.value()) {
                return todayPomodoros;
              } else {
                return [...todayPomodoros, today];
              }
            }
          };

          const newStats = {
            totalPomodoros: prev.totalPomodoros + 1,
            todayPomodoros: newDailyStats[currentDate].count,
            totalFocusTime: prev.totalFocusTime + customTimerLength,
            Pomodoros: nowPomodoro(),
            dailyStats: newDailyStats,
            weeklyStats: newWeeklyStats
          };

          return newStats;
        });
      }
    },
    onTimerReset: () => {
      console.log('计时器已重置');
    },
    onTimerStateChange: (isRunning, minutes, seconds) => {
      // 可以在这里处理计时器状态变化
    }
  });

  // 添加调试信息
  console.log('当前登录状态:', isLogin);
    // 在组件加载完成后从数据存储加载任务
  useEffect(() => {
    const storedTasks = dataStorage.load("tasks");
    if (storedTasks) {
      setTasks(storedTasks);
    }
    
    // 加载番茄钟统计数据
    const storedStats = dataStorage.load("pomodoro_stats");
    if (storedStats) {
      // 确保新的数据结构存在
      const processedStats = {
        totalPomodoros: storedStats.totalPomodoros || 0,
        todayPomodoros: storedStats.todayPomodoros || 0,
        totalFocusTime: storedStats.totalFocusTime || 0,
        Pomodoros: storedStats.Pomodoros || [],
        dailyStats: storedStats.dailyStats || {},
        weeklyStats: storedStats.weeklyStats || {}
      };
      
      // 重新计算今日番茄钟数量
      const todayCount = getTodayPomodoroCount(processedStats);
      processedStats.todayPomodoros = todayCount;
      
      setPomodoroStats(processedStats);
    }
  }, [dataStorage]);

  function updateTasks(newTasks){
    try{
      // const bindedTasks = window.DataStorage.bindNewArrayElement(newTasks);
      dataStorage.save("tasks", newTasks);
    }catch (error) {
      console.error("Error saving tasks remote:", error);
    }
    setTasks(newTasks);
  }

  dataStorage.registerUpdateEventWithKey("tasks", ()=>{
    const storedTasks = dataStorage.load("tasks");
    setTasks(storedTasks || []);
  })

  dataStorage.registerUpdateEventWithKey("tasks", ()=>{
    const data = dataStorage.load("pomodoro_stats");
    setPomodoroStats(data || []);
  })

  // 添加新任务
  const addTask = () => {
    if (newTaskText.trim() !== '') {
      updateTasks([...tasks, { id: Date.now(), title: newTaskText, completed: false }]);
      setNewTaskText('');
    }
  };

  // 切换任务完成状态
  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    updateTasks(updatedTasks);
  };
  
  // 编辑任务
  const editTitleOfTask = (id, newTitle) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, title: newTitle } : task
    );
    dataStorage.save("tasks", updateTasks);
  }

  const deleteTask = (id) => {
    // const updatedTasks = tasks.filter(task => task.id !== id);
    const updatedTasks = tasks.map(task => task.id == id ? {...task, isDelete: true} : task);
    updateTasks(updatedTasks);
  };

  // 保存番茄钟统计数据 - 只在初始化时保存一次，避免无限循环
  useEffect(() => {
    // 只有当统计数据不是初始值时才保存，避免无意义的保存
    if (pomodoroStats.totalPomodoros > 0 || pomodoroStats.todayPomodoros > 0 || pomodoroStats.totalFocusTime > 0) {
      // 将 StringAlias 对象转换为字符串进行保存
      const statsToSave = {
        ...pomodoroStats,
        
      };
      dataStorage.save("pomodoro_stats", statsToSave);
    }
  }, [pomodoroStats, dataStorage]);

  // 实时验证注册表单
  useEffect(() => {
    if (showRegister) {
      const errors = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      };

      if (registerUsername.length > 0 && registerUsername.length < 3) {
        errors.username = '用户名至少需要3个字符';
      }

      if (email.length > 0) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          errors.email = '请输入有效的邮箱地址';
        }
      }

      if (registerPassword.length > 0 && registerPassword.length < 6) {
        errors.password = '密码至少需要6个字符';
      }

      if (confirmPassword.length > 0 && confirmPassword !== registerPassword) {
        errors.confirmPassword = '两次输入的密码不一致';
      }

      setRegisterErrors(errors);
    }
  }, [registerUsername, email, registerPassword, confirmPassword, showRegister]);

  // 在 useEffect 中加载个人资料数据
  useEffect(() => {
    const storedSignature = dataStorage.load("user_signature") || "今天也是专注的一天！";
    setSignature(storedSignature);
    setTempSignature(storedSignature);
  }, [dataStorage]);

  // 保存签名的处理函数
  const handleSaveSignature = () => {
    setSignature(tempSignature);
    dataStorage.save("user_signature", tempSignature);
    setIsEditingSignature(false);
  };

  // 取消编辑的处理函数
  const handleCancelEdit = () => {
    setTempSignature(signature);
    setIsEditingSignature(false);
  };

  // 应用自定义时长
  const applyCustomTime = () => {
    setCustomTimerLength(customTimerLength);
    pomodoroTimer.resetTimer();
    setIsSettingsOpen(false);
  };

  // 切换屏幕锁定
  const toggleScreenLock = () => {
    setIsScreenLocked(!isScreenLocked);
  };

  // 登录处理函数
  const handleLogin = () => {
    if (!username.trim()) {
      alert('请输入用户名');
      usernameInputRef.current?.focus();
      return;
    }
    if (!password.trim()) {
      alert('请输入密码');
      passwordInputRef.current?.focus();
      return;
    }

    setIsLogin(true);
  };

  // 处理用户名输入框的键盘事件
  const handleUsernameKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      passwordInputRef.current?.focus();
    }
  };

  // 处理密码输入框的键盘事件
  const handlePasswordKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  // 注册页面的键盘事件处理
  const handleRegisterUsernameKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // 跳转到邮箱输入框
      const emailInput = document.querySelector('input[type="email"]');
      emailInput?.focus();
    }
  };

  const handleRegisterEmailKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // 跳转到密码输入框
      const passwordInputs = document.querySelectorAll('.register-input[type="password"]');
      passwordInputs[0]?.focus();
    }
  };

  const handleRegisterPasswordKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // 跳转到确认密码输入框
      const passwordInputs = document.querySelectorAll('.register-input[type="password"]');
      passwordInputs[1]?.focus();
    }
  };

  const handleRegisterConfirmPasswordKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitRegister();
    }
  };

  // 注册处理函数
  const handleRegister = () => {
    setShowRegister(true);
  };

  // 提交注册信息
  const submitRegister = () => {
    // 清空之前的错误信息
    setRegisterErrors({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    
    let hasError = false;

    if (!registerUsername.trim()) {
      alert('请输入用户名');
      setRegisterErrors(prev => ({ ...prev, username: '用户名不能为空' }));
      hasError = true;
    } else if (registerUsername.trim().length < 3) {
      alert('用户名至少需要3个字符');
      setRegisterErrors(prev => ({ ...prev, username: '用户名至少需要3个字符' }));
      hasError = true;
    }

    if (!email.trim()) {
      alert('请输入邮箱');
      setRegisterErrors(prev => ({ ...prev, email: '邮箱不能为空' }));
      hasError = true;
    } else {
      // 简单的邮箱格式验证
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.trim())) {
        alert('请输入有效的邮箱地址');
        setRegisterErrors(prev => ({ ...prev, email: '请输入有效的邮箱地址' }));
        hasError = true;
      }
    }

    if (!registerPassword.trim()) {
      alert('请输入密码');
      setRegisterErrors(prev => ({ ...prev, password: '密码不能为空' }));
      hasError = true;
    } else if (registerPassword.length < 6) {
      alert('密码至少需要6个字符');
      setRegisterErrors(prev => ({ ...prev, password: '密码至少需要6个字符' }));
      hasError = true;
    }

    if (registerPassword !== confirmPassword) {
      alert('两次输入的密码不一致');
      setRegisterErrors(prev => ({ ...prev, confirmPassword: '两次输入的密码不一致' }));
      hasError = true;
    }
    
    if (hasError) {
      return; // 如果有错误，阻止提交
    }
    
    // 这里可以添加实际的注册逻辑
    // 可以集成到您的 dataStorage 系统中
    alert('注册成功！请使用新账户登录。');
    
    // 注册成功后回到登录页面，并自动填入用户名
    setShowRegister(false);
    setUsername(registerUsername); // 自动填入刚注册的用户名
    setRegisterUsername('');
    setRegisterPassword('');
    setConfirmPassword('');
    setEmail('');
    backToLogin();
  };

  // 返回登录页面
  const backToLogin = () => {
    setShowRegister(false);
    setRegisterUsername('');
    setRegisterPassword('');
    setConfirmPassword('');
    setEmail('');
    
    // 确保登录状态字段也被清理
    setUsername('');
    setPassword('');
    setTimeout(() => {
      usernameInputRef.current?.focus();
    }, 100);
  };
  // Prepare props for AppRouter
  const appProps = {
    // Data
    pomodoroTimer,
    pomodoroStats,
    tasks,
    newTaskText,
    menuOpenTaskId,
    editingTaskId,
    editingTaskTitle,
    customTimerLength,
    isSettingsOpen,
    signature,
    isEditingSignature,
    tempSignature,
    dataStorage,
    // Setters
    setNewTaskText,
    setMenuOpenTaskId,
    setEditingTaskId,
    setEditingTaskTitle,
    setCustomTimerLength,
    setIsSettingsOpen,
    setTempSignature,
    setIsEditingSignature,
    // Functions
    addTask,
    toggleTaskCompletion,
    updateTasks,
    deleteTask,
    applyCustomTime,
    handleSaveSignature,
    handleCancelEdit,
    count_pomodoros,
    hasSevenConsecutivePomodoros,
    getTodayPomodoroCount,
    getThisWeekPomodoroCount,
    hasWeekly30Pomodoros
  };

  // 主渲染函数
  return (
    <AppRouter
      // Auth state
      isLogin={isLogin}
      isScreenLocked={isScreenLocked}
      showRegister={showRegister}
      // Auth handlers
      handleLogin={handleLogin}
      handleRegister={handleRegister}
      submitRegister={submitRegister}
      backToLogin={backToLogin}
      // Screen lock handler
      toggleScreenLock={toggleScreenLock}
      // Auth form state
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
      usernameInputRef={usernameInputRef}
      passwordInputRef={passwordInputRef}
      handleUsernameKeyPress={handleUsernameKeyPress}
      handlePasswordKeyPress={handlePasswordKeyPress}
      // Register state
      registerUsername={registerUsername}
      registerPassword={registerPassword}
      confirmPassword={confirmPassword}
      email={email}
      setRegisterUsername={setRegisterUsername}
      setRegisterPassword={setRegisterPassword}
      setConfirmPassword={setConfirmPassword}
      setEmail={setEmail}
      registerErrors={registerErrors}
      handleRegisterUsernameKeyPress={handleRegisterUsernameKeyPress}
      handleRegisterEmailKeyPress={handleRegisterEmailKeyPress}
      handleRegisterPasswordKeyPress={handleRegisterPasswordKeyPress}
      handleRegisterConfirmPasswordKeyPress={handleRegisterConfirmPasswordKeyPress}
      // App data and handlers
      {...appProps}
    />
  );
}

export default App;
