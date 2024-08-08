import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserListItemProps {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  onPress: () => void;
  showAddButton?: boolean;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onPress, showAddButton }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{user.name}</Text>
      </View>
      {showAddButton && (
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="person-add" size={24} color="#007AFF" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 5,
  },
});

export default UserListItem;