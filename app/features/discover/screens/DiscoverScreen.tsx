import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useGetDiscoverUsersQuery } from '../../../services/api';
import UserListItem from '../../messages/components/UserListItem';
import { User } from '../../../types/sharedTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AppNavigation';

const DiscoverScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const { data: discoverUsers, isLoading } = useGetDiscoverUsersQuery();
  const [filteredUsers, setFilteredUsers] = useState(discoverUsers);

  useEffect(() => {
    if (discoverUsers) {
      setFilteredUsers(
        discoverUsers.filter((user: User) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [discoverUsers, searchQuery]);

  const handleUserPress = (userId: string) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  };

  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Découvrir de nouveaux amis"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={['Tous', 'Populaires', 'Nouveaux', 'Recommandés']}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item}
        style={styles.categoriesList}
      />
      <FlatList
        data={filteredUsers}
        renderItem={({ item }) => (
            <UserListItem
            user={{
              id: item.id,
              name: item.name,
              avatar: item.avatar || 'https://via.placeholder.com/150'
            }}
            onPress={() => handleUserPress(item.id)}
            showAddButton
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  categoriesList: {
    marginVertical: 10,
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DiscoverScreen;