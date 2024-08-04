import React from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useRecoilState, useRecoilValue } from 'recoil';
import { newGroupNameState, newGroupDescriptionState, newGroupImageState, groupsState } from '../recoil/groupAtoms';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/navigationTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateGroup'>;

function CreateGroupScreen({ navigation }: Props) {
  const [newGroupName, setNewGroupName] = useRecoilState(newGroupNameState);
  const [newGroupDescription, setNewGroupDescription] = useRecoilState(newGroupDescriptionState);
  const [newGroupImage, setNewGroupImage] = useRecoilState(newGroupImageState);
  const groups = useRecoilValue(groupsState);

  // Function to create a group in Firestore
  const createGroup = async () => {
    try {
      // Check if group name is empty
      if (!newGroupName.trim()) {
        Alert.alert('Group Name Required', 'Please enter a name for the group.');
        return;
      }

      // Create a document in the 'groups' collection with group data
      const docRef = await addDoc(collection(db, 'groups'), {
        name: newGroupName,
        description: newGroupDescription,
        image: newGroupImage,
        members: [], // Initial members array, can be updated later
        messages: [], // Initial messages array, can be updated later
      });

      console.log('Document written with ID: ', docRef.id);

      // Update Recoil state after creating the group
      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupImage('');
      // Optionally update groups state if needed
      // setGroups([...groups, { id: docRef.id, name: newGroupName, description: newGroupDescription, image: newGroupImage, members: [], messages: [] }]);

      // Navigate to group detail screen or another screen
      // Example: navigation.navigate('GroupDetail', { groupId: docRef.id });

    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'Failed to create group. Please try again later.');
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
