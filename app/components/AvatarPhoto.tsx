import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectProfile } from '../features/profile/profileSlice';

interface AvatarPhotoProps {
  size?: number;
}

const AvatarPhoto: React.FC<AvatarPhotoProps> = ({ size = 50 }) => {
  const profile = useSelector(selectProfile);
  const avatarUrl = profile?.avatarUrl;

  if (!avatarUrl) {
    return (
      <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]} />
    );
  }

  return (
    <Image
      source={{ uri: avatarUrl }}
      style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: '#ccc',
  },
});

export default AvatarPhoto;