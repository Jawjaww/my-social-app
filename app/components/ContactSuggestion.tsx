import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Contact } from '../types/sharedTypes';

interface ContactSuggestionProps {
  contact: Contact;
  onPress?: () => void;
}

const ContactSuggestion: React.FC<ContactSuggestionProps> = ({ contact, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {contact.contactAvatarUrl ? (
        <Image source={{ uri: contact.contactAvatarUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholderAvatar]}>
          <Text style={styles.placeholderText}>
            {contact.contactUsername ? contact.contactUsername[0].toUpperCase() : '?'}
          </Text>
        </View>
      )}
      <Text style={styles.username}>{contact.contactUsername || 'Unknown User'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  placeholderAvatar: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    color: '#fff',
  },
  username: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ContactSuggestion;