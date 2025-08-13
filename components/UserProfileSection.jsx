import React, { memo } from 'react';
import { View, Text } from 'react-native';
import ProfilePicturePicker from '@components/ProfilePicturePicker';
import LevelDisplay from '@components/LevelDisplay';
import Constants from 'expo-constants';

const UserProfileSection = memo(({ 
  user, 
  profile, 
  profileLoading, 
  profileError, 
  levelInfo,
  styles 
}) => {
  const getProfilePictureUrl = () => {
    if (!profile?.profilePictureFileId) return null;
    const STORAGE_BUCKET_ID = Constants.expoConfig.extra.STORAGE_BUCKET_ID;
    return `https://nyc.cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${profile.profilePictureFileId}/view?project=686b296f003243270240`;
  };

  if (!user) return null;
  
  return (
    <View style={{ alignItems: "center", marginTop: 12, marginBottom: 8 }}>
      <ProfilePicturePicker
        currentImageUrl={getProfilePictureUrl()}
        onImageUpdate={() => {}}
        size={100}
      />
      {profileLoading ? (
        <Text style={styles.username}>Loading...</Text>
      ) : profileError ? (
        <Text style={styles.username}>Error</Text>
      ) : (
        <Text style={styles.username}>
          {profile?.username || "No username"}
        </Text>
      )}
      <View style={styles.levelSection}>
        <LevelDisplay
          level={levelInfo.level}
          currentLevelXP={levelInfo.currentLevelXP}
          xpToNextLevel={levelInfo.xpToNextLevel}
          totalXP={levelInfo.totalXP}
          levelTitle={levelInfo.levelTitle}
          levelColor={levelInfo.levelColor}
          consecutiveCompletions={levelInfo.consecutiveCompletions}
          showStreak={true}
        />
      </View>
    </View>
  );
});

UserProfileSection.displayName = 'UserProfileSection';

export default UserProfileSection;