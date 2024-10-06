import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { ContactsStackParamList } from '../../../types/sharedTypes';
import { useGetContactProfileQuery } from '../../../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { selectContacts } from '../../contacts/contactsSelectors';

type ContactDetailsRouteProp = RouteProp<ContactsStackParamList, 'ContactDetails'>;

const ContactDetailsScreen: React.FC = () => {
  const route = useRoute<ContactDetailsRouteProp>();
  const { contactUid } = route.params;
  const { t } = useTranslation();
  const { data: contactProfile, isLoading, isError } = useGetContactProfileQuery(contactUid);
  const contacts = useSelector(selectContacts);
  const contact = contacts[contactUid];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>{t('contacts.loading')}</Text>
      </View>
    );
  }

  if (isError || !contactProfile) {
    return (
      <View style={styles.container}>
        <Text>{t('contacts.contactNotFound')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {contact.contactAvatarUrl ? (
        <Image source={{ uri: contact.contactAvatarUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholderAvatar]}>
          <Text style={styles.avatarText}>
            {contact.contactUsername?.[0].toUpperCase()}
          </Text>
        </View>
      )}
      <Text style={styles.username}>{contact.contactUsername}</Text>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#007AFF" />
          <Text style={styles.actionText}>{t('contacts.message')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="call-outline" size={24} color="#007AFF" />
          <Text style={styles.actionText}>{t('contacts.call')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="videocam-outline" size={24} color="#007AFF" />
          <Text style={styles.actionText}>{t('contacts.videoCall')}</Text>
        </TouchableOpacity>
      </View>

      {contact.bio && (
        <View style={styles.bioContainer}>
          <Text style={styles.bioTitle}>{t('contacts.bio')}</Text>
          <Text style={styles.bioText}>{contactProfile.bio}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  placeholderAvatar: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 5,
    color: '#007AFF',
  },
  bioContainer: {
    marginTop: 20,
    width: '100%',
    padding: 10,
  },
  bioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bioText: {
    fontSize: 16,
  },
});

export default ContactDetailsScreen;