// YatPotato Router Component
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import TimerPage from '../pages/TimerPage';
import TasksPage from '../pages/TasksPage';
import ReportsPage from '../pages/ReportsPage';
import ProfilePage from '../pages/ProfilePage';
import LockScreen from '../pages/LockScreen';
import LoginPage from '../auth/LoginPage';
import RegisterPage from '../auth/RegisterPage';
import ChatPage from '../chat/ChatPage'; // <--- 导入ChatPage

const AppRouter = ({ 
  isLogin, 
  isScreenLocked, 
  showRegister,
  // Auth handlers
  handleLogin,
  handleRegister,
  submitRegister,
  backToLogin,
  // Screen lock handler
  toggleScreenLock,
  // Auth state
  username,
  password,
  setUsername,
  setPassword,
  usernameInputRef,
  passwordInputRef,
  handleUsernameKeyPress,
  handlePasswordKeyPress,
  // Register state
  registerUsername,
  registerPassword,
  confirmPassword,
  email,
  setRegisterUsername,
  setRegisterPassword,
  setConfirmPassword,
  setEmail,
  registerErrors,
  handleRegisterUsernameKeyPress,
  handleRegisterEmailKeyPress,
  handleRegisterPasswordKeyPress,
  handleRegisterConfirmPasswordKeyPress,
  // App data and handlers
  ...appProps
}) => {
  // If screen is locked, show lock screen regardless of route
  if (isScreenLocked) {
    return (
      <LockScreen 
        toggleScreenLock={toggleScreenLock}
        {...appProps}
      />
    );
  }

  // If not logged in, show auth screens
  if (!isLogin) {
    if (showRegister) {
      return (
        <RegisterPage
          registerUsername={registerUsername}
          registerPassword={registerPassword}
          confirmPassword={confirmPassword}
          email={email}
          setRegisterUsername={setRegisterUsername}
          setRegisterPassword={setRegisterPassword}
          setConfirmPassword={setConfirmPassword}
          setEmail={setEmail}
          registerErrors={registerErrors}
          submitRegister={submitRegister}
          backToLogin={backToLogin}
          handleRegisterUsernameKeyPress={handleRegisterUsernameKeyPress}
          handleRegisterEmailKeyPress={handleRegisterEmailKeyPress}
          handleRegisterPasswordKeyPress={handleRegisterPasswordKeyPress}
          handleRegisterConfirmPasswordKeyPress={handleRegisterConfirmPasswordKeyPress}
        />
      );
    } else {
      return (
        <LoginPage
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          usernameInputRef={usernameInputRef}
          passwordInputRef={passwordInputRef}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          handleUsernameKeyPress={handleUsernameKeyPress}
          handlePasswordKeyPress={handlePasswordKeyPress}
        />
      );
    }
  }

  // Main app routes (when logged in)
  return (
    <Router>
      <MainLayout toggleScreenLock={toggleScreenLock}>
        <Routes>
          <Route path="/" element={<Navigate to="/timer" replace />} />
          <Route path="/timer" element={<TimerPage {...appProps} />} />
          <Route path="/tasks" element={<TasksPage {...appProps} />} />
          <Route path="/reports" element={<ReportsPage {...appProps} />} />
          <Route path="/profile" element={<ProfilePage {...appProps} />} />
          <Route path="/chat" element={<ChatPage {...appProps} />} /> 
          <Route path="*" element={<Navigate to="/timer" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
