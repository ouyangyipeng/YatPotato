// Profile Header Component
import React from 'react';

const ProfileHeader = ({
  signature,
  isEditingSignature,
  tempSignature,
  setIsEditingSignature,
  setTempSignature,
  handleSaveSignature,
  handleCancelEdit
}) => {
  return (
    <div className="profile-header">
      <div className="user-avatar">
        <span>🍅</span>
      </div>
      <div className="user-info">
        <h1 className="username">test</h1>
        
        {isEditingSignature ? (
          <div className="signature-edit">
            <input
              type="text"
              value={tempSignature}
              onChange={(e) => setTempSignature(e.target.value)}
              autoFocus
              maxLength={50}
            />
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSaveSignature}>保存</button>
              <button className="cancel-btn" onClick={handleCancelEdit}>取消</button>
            </div>
          </div>
        ) : (
          <div className="signature-display">
            <p>{signature}</p>
            <button 
              className="edit-btn" 
              onClick={() => setIsEditingSignature(true)}
              title="编辑个性签名"
            >
              ✏️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
