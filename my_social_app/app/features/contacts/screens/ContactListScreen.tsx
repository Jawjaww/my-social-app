import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Contact, ContactsStackParamList, RootStackParamList } from '../../../types/sharedTypes';
import { useContacts } from '../../../hooks/useContacts';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import AvatarPhoto from '../../../components/AvatarPhoto';
import { useDeleteContactMutation } from '../../../services/api';
import { useTranslation } from 'react-i18next';
import { CompositeNavigationProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectUser } from '../../authentication/authSelectors';

type ContactListScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ContactsStackParamList, 'ContactList'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const ContactListScreen: React.FC = () => {
  const navigation = useNavigation<ContactListScreenNavigationProp>();
  const { contacts, isLoading, isError } = useContacts();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const { t } = useTranslation();
  const [deleteContact] = useDeleteContactMutation();
  const user = useSelector(selectUser);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      contact.contactUsername.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  console.log('Contacts dans ContactListScreen:', contacts);

  const handleContactPress = (contactUid: string) => {
    navigation.navigate('Main', {
      screen: 'Messages',
      params: {
        screen: 'Chat',
        params: { contactUid },
      },
    });
  };

  const handleDeleteContact = (contactUid: string, contactName: string) => {
    Alert.alert(
      t('contacts.deleteConfirmTitle'),
      t('contacts.deleteConfirmMessage', { name: contactName }),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('common.delete'),
          onPress: async () => {
            if (user) {
              try {
                await deleteContact({ userUid: user.uid, contactUid }).unwrap();
              } catch (error) {
                console.error('Failed to delete contact:', error);
                Alert.alert(t('contacts.deleteErrorTitle'), t('contacts.deleteErrorMessage'));
              }
            } else {
              Alert.alert(t('common.error'), t('common.userNotFound'));
            }
          },
          style: 'destructive'
        }
      ],
      { cancelable: false }
    );
  };

  const ContactItem: React.FC<{ 
    contact: Contact; 
    onPress: () => void; 
    onLongPress: () => void;
  }> = ({ contact, onPress, onLongPress }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <AvatarPhoto
        size={50}
        avatarSource={contact.contactAvatarUri || contact.contactAvatarUrl}
        username={contact.contactUsername}
      />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.contactUsername}</Text>
        <Text style={styles.contactBio} numberOfLines={1}>{contact.bio || t('contacts.noBio')}</Text>
      </View>
      <Text style={styles.lastInteraction}>
        {new Date(contact.lastInteraction).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <ActivityIndicator size="large" color={theme.colors.primary} />;
  }

  if (isError) {
    return <Text>{t('contacts.errorLoading')}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color={theme.colors.text} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('contacts.searchPlaceholder')}
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>
      <FlatList
        data={filteredContacts}
        renderItem={({ item }) => (
          <ContactItem
            contact={item}
            onPress={() => handleContactPress(item.contactUid)}
            onLongPress={() => handleDeleteContact(item.contactUid, item.contactUsername)}
          />
        )}
        keyExtractor={(item) => item.contactUid}
        ListEmptyComponent={<Text style={styles.emptyList}>{t('contacts.noContacts')}</Text>}
      />
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddContact')}
      >
        <Ionicons name="add" size={30} color={theme.colors.background} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 10,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactBio: {
    fontSize: 14,
    color: 'gray',
  },
  lastInteraction: {
    fontSize: 12,
    color: 'gray',
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactListScreen;