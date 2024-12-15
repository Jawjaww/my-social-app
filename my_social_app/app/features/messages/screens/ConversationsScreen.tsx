import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { selectContacts } from '../../contacts/contactsSelectors';
import { useGetContactProfileQuery } from '../../../services/api';
import { RootState } from "../../../store/store";
import { Contact } from "../../../types/sharedTypes";

const ConversationListItem: React.FC<{ contactUid: string }> = ({ contactUid }) => {
  const { data: profile, isLoading, isError } = useGetContactProfileQuery(contactUid);
  const contact = useSelector((state: RootState) => selectContacts(state)[contactUid]) as Contact;
    if (isLoading) return <Text>Loading...</Text>;
    if (isError) return <Text>Error loading profile</Text>;
    
    // Check if contact exists before rendering
    if (!contact) return null;

    // Remove nested ConversationListItem component
    if (!contact.lastInteraction) {
      return null; // or a placeholder component
    }

  return (
    <View>
      <Text>{profile?.contactUsername || 'Unknown'}</Text>
      <Text>{new Date(contact.lastInteraction).toLocaleString()}</Text>
    </View>
  );
};

const ConversationsScreen: React.FC = () => {
  const contacts = useSelector(selectContacts);

  return (
    <FlatList
      data={Object.keys(contacts)}
      renderItem={({ item: contactUid }) => <ConversationListItem contactUid={contactUid} />}
      keyExtractor={(contactUid) => contactUid}
    />
  );
};

export default ConversationsScreen;