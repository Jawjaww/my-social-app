import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAddContactMutation } from '../../../services/api';
import { AddContactScreenProps } from '../contactsTypes';

const AddContactScreen: React.FC<AddContactScreenProps> = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [addContact, { isLoading }] = useAddContactMutation();

  const handleAddContact = async () => {
    try {
      await addContact({ userId });
      Alert.alert('Success', 'Contact added successfully');
      setUserId('');
      navigation.navigate('ContactList');
    } catch (error) {
      Alert.alert('Error', 'Failed to add contact');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={userId}
        onChangeText={setUserId}
        placeholder="Enter contact's user ID"
      />
      <Button
        title="Add Contact"
        onPress={handleAddContact}
        disabled={isLoading || !userId.trim()}
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