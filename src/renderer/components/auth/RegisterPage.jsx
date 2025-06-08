// Register Page Component
import React from 'react';

const RegisterPage = ({
  registerUsername,
  registerPassword,
  confirmPassword,
  email,
  setRegisterUsername,
  setRegisterPassword,
  setConfirmPassword,
  setEmail,
  registerErrors,
  submitRegister,
  backToLogin,
  handleRegisterUsernameKeyPress,
  handleRegisterEmailKeyPress,
  handleRegisterPasswordKeyPress,
  handleRegisterConfirmPasswordKeyPress
}) => {
  return (
    <div className="register-screen-desktop">
      <div className="register-container">
        <div className="login-content">
          <div className="login-header">
            <div className="app-logo-desktop">🍅</div>
            <h1 className="app-title-desktop">YatPotato</h1>
            <p className="app-subtitle-desktop">创建你的专注账户</p>
          </div>

          <div className="login-form-wrapper">
            <form className="login-form-desktop register-form" onSubmit={(e) => {e.preventDefault(); submitRegister();}}>
              <div className="input-group">
                <div className="input-icon">👤</div>
                <input
                  type="text"
                  placeholder="用户名"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  className={`register-input ${registerErrors.username ? 'error' : ''}`}
                  autoFocus
                  onKeyPress={handleRegisterUsernameKeyPress}
                />
                {registerErrors.username && <span className="error-message">{registerErrors.username}</span>}
              </div>

              <div className="input-group">
                <div className="input-icon">📧</div>
                <input
                  type="email"
                  placeholder="邮箱地址"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`register-input ${registerErrors.email ? 'error' : ''}`}
                  onKeyPress={handleRegisterEmailKeyPress}
                />
                {registerErrors.email && <span className="error-message">{registerErrors.email}</span>}
              </div>
              
              <div className="input-group">
                <div className="input-icon">🔒</div>
                <input
                  type="password"
                  placeholder="密码"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className={`register-input ${registerErrors.password ? 'error' : ''}`}
                  onKeyPress={handleRegisterPasswordKeyPress}
                />
                {registerErrors.password && <span className="error-message">{registerErrors.password}</span>}
              </div>

              <div className="input-group">
                <div className="input-icon">🔒</div>
                <input
                  type="password"
                  placeholder="确认密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`register-input ${registerErrors.confirmPassword ? 'error' : ''}`}
                  onKeyPress={handleRegisterConfirmPasswordKeyPress}
                />
                {registerErrors.confirmPassword && <span className="error-message">{registerErrors.confirmPassword}</span>}
              </div>
              
              <button type="submit" className="register-btn-primary">
                创建账户
              </button>
            </form>
            
            <button className="register-btn-secondary" onClick={backToLogin}>
              已有账号？返回登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
