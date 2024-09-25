import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectProfile } from '../features/profile/profileSelectors';
import { useTheme } from '@emotion/react';
import { AvatarPhotoProps } from '../types/sharedTypes';

const AvatarPhoto: React.FC<AvatarPhotoProps> = ({ size = 50, isActive = false }) => {
  const theme = useTheme();
  const profile = useSelector(selectProfile);
  const avatarUri = profile?.avatarUri;
  const avatarUrl = profile?.avatarUrl;
  const username = profile?.username;

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
    return (
      <Image
        source={{ uri: avatarUri }}
        style={styles.image}
      />
    );
  }

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={styles.image}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.letter}>{username?.charAt(0).toUpperCase() || '?'}</Text>
    </View>
  );
};

export default AvatarPhoto;