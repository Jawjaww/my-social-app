import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Contact } from '../types/sharedTypes';

interface ContactSuggestionProps {
  contact: Contact;
}

const ContactSuggestion: React.FC<ContactSuggestionProps> = ({ contact }) => {
  return (
    <TouchableOpacity>
      <View>
        <Text>{contact.username}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ContactSuggestion;