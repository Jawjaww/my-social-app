import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGetContactsQuery } from '../../../services/api';
import { ContactListScreenProps } from '../../../types/sharedTypes';

const ContactListScreen: React.FC<ContactListScreenProps> = ({ navigation }) => {
  const { data: contacts, isLoading, error } = useGetContactsQuery();

  if (isLoading) {
    return <View style={styles.centered}><Text>Loading...</Text></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text>Error loading contacts</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => navigation.navigate('Main', {
              screen: 'Messages',
              params: { screen: 'Chat', params: { contactId: item.id } }
            } as any)}
          >
            <Text>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddContact')}
      >
        <Text>Add Contact</Text>
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
  contactItem: {
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

export default ContactListScreen;