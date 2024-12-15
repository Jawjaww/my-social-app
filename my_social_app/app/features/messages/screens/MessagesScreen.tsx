import React, { useCallback } from 'react';
import { View, ActivityIndicator, Text, Alert } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import type { IMessage } from 'react-native-gifted-chat';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery, useSendMessageMutation, useDeleteMessageMutation } from '../../../services/api';
import { selectProfile } from '../../profile/profileSelectors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MessagesStackParamList } from '../../../types/sharedTypes';
import { useTranslation } from 'react-i18next';
import Toast from '../../../components/Toast';
import { useRoute } from '@react-navigation/native';

interface Props {
  navigation: NativeStackNavigationProp<MessagesStackParamList, 'Chat'>;
  route: RouteProp<MessagesStackParamList, 'Chat'>;
}

const MessagesScreen: React.FC<Props> = ({ navigation, route }) => {
  const contactUid = route.params?.contactUid;
  const user = useSelector(selectProfile);
  const { data: messages, isLoading, error } = useGetMessagesQuery(contactUid ?? '');
  const [sendMessage] = useSendMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const { t } = useTranslation();

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    if (contactUid) {
      newMessages.forEach((message) => {
        sendMessage({ userId: contactUid, message });
      });
    }
  }, [contactUid, sendMessage]);

  if (!contactUid) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{t('messages.noFriendSelected')}</Text>
      </View>
    );
  }

  if (isLoading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (messages && messages.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{t('messages.noMessages')}</Text>
      </View>
    );
  }

  const handleDeleteMessage = async (messageId: string) => {
    Alert.alert(
      t('deleteMessage.confirmTitle'),
      t('deleteMessage.confirmMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.confirm'),
          onPress: async () => {
            try {
              await deleteMessage({ messageId }).unwrap(); 
              Toast({ message: t('deleteMessage.success'), type: 'success' });
            } catch (error) {
              Toast({ message: t('deleteMessage.error'), type: 'error' });
            }
          },
        },
      ]
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: user.uid,
        name: user.username || 'Unknown',
        avatar: user.avatarUrl || undefined,
      }}
      renderBubble={(props) => (
        <Bubble {...props} />
      )}
      // Ajoutez d'autres personnalisations si nécessaire
    />
  );
};

export default MessagesScreen;