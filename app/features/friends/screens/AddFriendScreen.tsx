import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAddFriendMutation } from '../../../services/api';
import { AddFriendScreenProps } from '../friendsTypes';

const AddFriendScreen: React.FC<AddFriendScreenProps> = ({ navigation }) => {
  const [userId, setUserId] = useState('');
  const [addFriend, { isLoading }] = useAddFriendMutation();

  const handleAddFriend = async () => {
    try {
      await addFriend({ userId });
      Alert.alert('Success', 'Friend added successfully');
      setUserId('');
      navigation.navigate('FriendList');
    } catch (error) {
      Alert.alert('Error', 'Failed to add friend');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={userId}
        onChangeText={setUserId}
        placeholder="Enter friend's user ID"
      />
      <Button
        title="Add Friend"
        onPress={handleAddFriend}
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

export default AddFriendScreen;