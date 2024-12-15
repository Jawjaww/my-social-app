import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectProfile } from '../features/profile/profileSelectors';
import { useTheme } from '@emotion/react';
import { AvatarPhotoProps } from '../types/sharedTypes';

const AvatarPhoto: React.FC<AvatarPhotoProps> = ({ 
  size = 50, 
  isActive = false, 
  avatarSource,
  username 
}) => {
  const theme = useTheme();
  const profile = useSelector(selectProfile);

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

  const avatarToUse = avatarSource || profile?.avatarUri || profile?.avatarUrl;

  if (avatarToUse) {
    return (
      <Image
        source={{ uri: avatarToUse }}
        style={styles.image}
      />
    );
  }

  // Si aucun avatar n'est disponible, afficher la première lettre du nom d'utilisateur
  const letter = username?.charAt(0).toUpperCase() || profile?.username?.charAt(0).toUpperCase() || '?';

  return (
    <View style={styles.container}>
      <Text style={styles.letter}>{letter}</Text>
    </View>
  );
};

export default AvatarPhoto;