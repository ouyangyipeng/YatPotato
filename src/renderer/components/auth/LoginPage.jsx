// Login Page Component
import React from 'react';

const LoginPage = ({
  username,
  password,
  setUsername,
  setPassword,
  usernameInputRef,
  passwordInputRef,
  handleLogin,
  handleRegister,
  handleUsernameKeyPress,
  handlePasswordKeyPress
}) => {
  return (
    <div className="login-screen-desktop">
      <div className="login-container-desktop">
        <div className="login-content">
          <div className="login-header">
            <div className="app-logo-desktop">🍅</div>
            <h1 className="app-title-desktop">YatPotato</h1>
            <p className="app-subtitle-desktop">专注时光，高效番茄</p>
          </div>

          <div className="login-form-wrapper">
            <form className="login-form-desktop" onSubmit={(e) => {e.preventDefault(); handleLogin();}}>
              <div className="input-group">
                <div className="input-icon">👤</div>
                <input
                  ref={usernameInputRef}
                  type="text"
                  placeholder="用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleUsernameKeyPress}
                  className="login-input"
                  autoFocus
                />
              </div>
              
              <div className="input-group">
                <div className="input-icon">🔒</div>
                <input
                  ref={passwordInputRef}
                  type="password"
                  placeholder="密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handlePasswordKeyPress}
                  className="login-input"
                />
              </div>
              
              <button type="submit" className="login-btn-primary">
                开始专注之旅
              </button>
            </form>
            
            <form className="login-form-desktop" onSubmit={(e) => {e.preventDefault(); handleRegister();}}>
              <button type="submit" className="register-btn-secondary">
                没有账号？注册一个新的吧！
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
