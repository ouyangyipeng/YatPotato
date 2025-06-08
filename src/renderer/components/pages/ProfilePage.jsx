// Profile Page Component
import React from 'react';
import AchievementsGrid from '../profile/AchievementsGrid';
import ProfileHeader from '../profile/ProfileHeader';

const ProfilePage = ({
  signature,
  isEditingSignature,
  tempSignature,
  setIsEditingSignature,
  setTempSignature,
  handleSaveSignature,
  handleCancelEdit,
  pomodoroStats,
  hasSevenConsecutivePomodoros,
  count_pomodoros,
  dataStorage
}) => {
  return (
    <div className="profile-screen">
      <ProfileHeader
        signature={signature}
        isEditingSignature={isEditingSignature}
        tempSignature={tempSignature}
        setIsEditingSignature={setIsEditingSignature}
        setTempSignature={setTempSignature}
        handleSaveSignature={handleSaveSignature}
        handleCancelEdit={handleCancelEdit}
      />

      <AchievementsGrid
        pomodoroStats={pomodoroStats}
        hasSevenConsecutivePomodoros={hasSevenConsecutivePomodoros}
        count_pomodoros={count_pomodoros}
        dataStorage={dataStorage}
      />
    </div>
  );
};

export default ProfilePage;
