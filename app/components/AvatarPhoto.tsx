import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectProfile } from '../features/profile/profileSelectors';
import { useTheme } from '@emotion/react';
import FastImage from 'react-native-fast-image';

interface AvatarPhotoProps {
  size?: number;
  isActive?: boolean;
  uri?: string | null;
  username?: string | null;
}

const AvatarPhoto: React.FC<AvatarPhotoProps> = ({ size = 24, isActive = false, uri, username }) => {
  const theme = useTheme();
  const avatarUri = uri || useSelector(selectProfile)?.avatarUri;
  const displayUsername = username || useSelector(selectProfile)?.username || '?';

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
    return <FastImage source={{ uri: avatarUri }} style={styles.image} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.letter}>{displayUsername[0].toUpperCase()}</Text>
    </View>
  );
};

export default AvatarPhoto;