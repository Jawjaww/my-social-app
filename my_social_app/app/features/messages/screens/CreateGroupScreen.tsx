import React from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import { newGroupNameState, newGroupDescriptionState, newGroupImageState, groupsState } from '../recoil/groupAtoms';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigation';
import Parse from 'parse/react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateGroup'>;

function CreateGroupScreen({ navigation }: Props) {
  const [newGroupName, setNewGroupName] = useRecoilState(newGroupNameState);
  const [newGroupDescription, setNewGroupDescription] = useRecoilState(newGroupDescriptionState);
  const [newGroupImage, setNewGroupImage] = useRecoilState(newGroupImageState);
  const groups = useRecoilValue(groupsState);

  // Function to create a group using Parse Server
  const createGroup = async () => {
    try {
      // Check if group name is empty
      if (!newGroupName.trim()) {
        Alert.alert('Group Name Required', 'Please enter a name for the group.');
        return;
      }

      // Create a new Parse Group object
      const Group = Parse.Object.extend('Group');
      const group = new Group();
      
      group.set({
        name: newGroupName,
        description: newGroupDescription,
        image: newGroupImage,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await group.save();
      
      // Reset form
      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupImage('');
      
      // Navigate back
      navigation.goBack();
      
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'Failed to create group. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <TextInput
        style={{ width: '100%', height: 40, borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
        placeholder="Group Name"
        value={newGroupName}
        onChangeText={setNewGroupName}
      />
      <TextInput
        style={{ width: '100%', height: 40, borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
        placeholder="Group Description"
        value={newGroupDescription}
        onChangeText={setNewGroupDescription}
        multiline
      />
      <TextInput
        style={{ width: '100%', height: 40, borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
        placeholder="Group Image URL"
        value={newGroupImage}
        onChangeText={setNewGroupImage}
      />
      <Button
        title="Create Group"
        onPress={createGroup}
      />
    </View>
  );
}

export default CreateGroupScreen;
