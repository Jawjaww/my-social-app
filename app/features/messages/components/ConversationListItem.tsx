import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface Conversation {
  id: string;
  contactUid: string;
  contactName: string;
  lastMessage: string;
  timestamp: number;
  avatar: string;
}

interface ConversationListItemProps {
  conversation: Conversation;
  onPress: () => void;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({ conversation, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={{ uri: conversation.avatar }} style={styles.avatar} />
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{conversation.contactName}</Text>
        <Text style={styles.message}>{conversation.lastMessage}</Text>
      </View>
      <Text style={styles.time}>{new Date(conversation.timestamp).toLocaleTimeString()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  message: {
    color: 'gray',
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
});

export default ConversationListItem;