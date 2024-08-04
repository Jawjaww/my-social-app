import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGetFriendsQuery } from '../../../services/api';
import { FriendListScreenProps, Friend } from '../friendsTypes';

const FriendListScreen: React.FC<FriendListScreenProps> = ({ navigation }) => {
  const { data: friends, isLoading, error } = useGetFriendsQuery();

  if (isLoading) {
    return <View style={styles.centered}><Text>Loading...</Text></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text>Error loading friends</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.friendItem}
            onPress={() => navigation.navigate('Messages', { friendId: item.id })}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddFriend')}
      >
        <Text>Add Friend</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default FriendListScreen;