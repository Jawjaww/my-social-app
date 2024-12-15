import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import type { IMessage } from 'react-native-gifted-chat';
import { RouteProp } from '@react-navigation/native';
import { MessagesStackParamList } from '../../../types/sharedTypes';

type GroupChatScreenRouteProp = RouteProp<MessagesStackParamList, 'GroupChat'>;

type Props = {
  route: GroupChatScreenRouteProp;
};

function GroupChatScreen({ route }: Props) {
  const { groupId } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    // Fetch group messages from the server based on groupId
    // setMessages(...);
  }, [groupId]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1, // Replace with the current user's ID
      }}
    />
  );
}

export default GroupChatScreen;
