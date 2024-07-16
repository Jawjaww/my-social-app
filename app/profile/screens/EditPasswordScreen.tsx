import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { updateUserPassword } from '../services/profileServices';

const EditPasswordScreen: React.FC = () => {
  const [password, setPassword] = useState('');

  const handleSave = async () => {
    try {
      await updateUserPassword(password);
    } catch (error) {
      console.error('Erreur de mise à jour du mot de passe :', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Modifier le Mot de Passe</Text>
      <TextInput
        style={styles.input}
        placeholder="Nouveau mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
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

export default EditPasswordScreen;
