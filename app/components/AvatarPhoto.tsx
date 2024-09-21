import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectProfile } from '../features/profile/profileSelectors';
import { useTheme } from '@emotion/react';
import FastImage from 'react-native-fast-image';
import * as FileSystem from 'expo-file-system';
import { AvatarPhotoProps } from '../types/sharedTypes';

const AvatarPhoto: React.FC<AvatarPhotoProps> = ({ size = 24, isActive = false }) => {
  const theme = useTheme();
  const profile = useSelector(selectProfile);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    const checkAvatarFile = async () => {
      if (profile?.avatarUri) {
        try {
          console.log("Checking avatar file at URI:", profile.avatarUri);
          const fileInfo = await FileSystem.getInfoAsync(profile.avatarUri);
          if (fileInfo.exists) {
            console.log("Avatar file exists:", profile.avatarUri);
            setAvatarUri(profile.avatarUri);
          } else {
            console.log("Avatar file does not exist:", profile.avatarUri);
          }
        } catch (error) {
          console.error("Error checking avatar file:", error);
        }
      } else {
        console.log("No avatar URI in profile");
      }
    };

    checkAvatarFile();
  }, [profile?.avatarUri]);

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isActive ? theme.colors.primary : theme.colors.textSecondary,
    },
    image: {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    letter: {
      color: 'white',
      fontSize: size / 2,
      fontWeight: 'bold',
    },
  });

  if (avatarUri) {
    return <FastImage 
      source={{ uri: avatarUri, priority: FastImage.priority.high }}
      style={styles.image} 
    />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.letter}>{profile?.username?.[0]?.toUpperCase() || '?'}</Text>
    </View>
  );
};

export default AvatarPhoto;