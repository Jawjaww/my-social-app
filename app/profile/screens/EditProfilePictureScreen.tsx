import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import { useRecoilState } from 'recoil';
import { userState } from '../../authentication/recoil/authAtoms';
import { uploadProfilePicture } from '../services/profileServices';
import styled from '@emotion/native';

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Header = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const StyledImage = styled(FastImage)`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  margin-bottom: 20px;
`;

const EditProfilePictureScreen: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (!result.didCancel && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri || null);
    }
  };

  const handleSave = async () => {
    try {
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], "profile_picture.jpg", { type: blob.type, lastModified: Date.now() });

        const photoURL = await uploadProfilePicture(file);
        if (user) {
          setUser({ ...user, photoURL: photoURL });
        }
      }
    } catch (error) {
      console.error('Erreur de mise à jour de la photo de profil :', error);
    }
  };

  return (
    <Container>
      <Header>Modifier la Photo de Profil</Header>
      <Button title="Choisir une image" onPress={pickImage} />
      {image && (
        <StyledImage
          source={{
            uri: image,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      <Button title="Enregistrer" onPress={handleSave} />
    </Container>
  );
};

export default EditProfilePictureScreen;