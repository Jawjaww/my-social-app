import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAddContactMutation } from '../../../services/api';
import { AddContactScreenProps } from '../../../types/sharedTypes';

const AddContactScreen: React.FC<AddContactScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [addContact, { isLoading }] = useAddContactMutation();

  const handleAddContact = async () => {
    try {
      await addContact({ username });
      Alert.alert('Succès', 'Contact ajouté avec succès');
      setUsername('');
      navigation.navigate('ContactList');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter le contact');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Entrez le nom d'utilisateur du contact"
      />
      <Button
        title="Ajouter le contact"
        onPress={handleAddContact}
        disabled={isLoading || !username.trim()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
});

export default AddContactScreen;