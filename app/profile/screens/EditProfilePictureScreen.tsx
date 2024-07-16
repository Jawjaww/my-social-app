import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRecoilState } from 'recoil';
import { userState } from '../../authentication/recoil/authAtoms';
import { uploadProfilePicture } from '../services/profileServices';

const EditProfilePictureScreen: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleSave = async () => {
    try {
      if (image) {
        const photoURL = await uploadProfilePicture(image);
        setUser({ ...user, photoURL });
      }
    } catch (error) {
      console.error('Erreur de mise à jour de la photo de profil :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Modifier la Photo de Profil</Text>
      <Button title="Choisir une image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Enregistrer" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
});

export default EditProfilePictureScreen;
