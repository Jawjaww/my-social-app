import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRecoilState } from 'recoil';
import { userState } from '../../authentication/recoil/authAtoms';
import { updateUserProfile } from '../services/profileServices';

const EditDisplayNameScreen: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [displayName, setDisplayName] = useState('');

  const handleSave = async () => {
    try {
      await updateUserProfile(displayName, user?.photoURL || null);
      setUser({ ...user, displayName });
    } catch (error) {
      console.error('Erreur de mise à jour du pseudo :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Modifier le Pseudo</Text>
      <TextInput
        style={styles.input}
        placeholder="Nouveau pseudo"
        value={displayName}
        onChangeText={setDisplayName}
      />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default EditDisplayNameScreen;
