import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRecoilValue } from 'recoil';
import { groupsSelector } from '../recoil/groupAtoms';

function GroupsScreen() {
  const groups = useRecoilValue(groupsSelector);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default GroupsScreen;
