import React, { useCallback } from 'react';
import { View, ActivityIndicator, Text, Alert } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery, useSendMessageMutation, useDeleteMessageMutation } from '../../../services/api';
import { selectProfile } from '../../profile/profileSelectors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MessagesStackParamList } from '../../../types/sharedTypes';
import { useTranslation } from 'react-i18next';
import Toast from '../../../components/Toast';

interface Props {
  navigation: NativeStackNavigationProp<MessagesStackParamList, 'Chat'>;
  route: RouteProp<MessagesStackParamList, 'Chat'>;
}

const MessagesScreen: React.FC<Props> = ({ navigation, route }) => {
  const contactId = route.params?.contactId;
  const user = useSelector(selectProfile) ;
  const { data: messages, isLoading, error } = useGetMessagesQuery(contactId ?? '');
  const [sendMessage] = useSendMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const { t } = useTranslation();

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    if (contactId) {
      newMessages.forEach((message) => {
        sendMessage({ userId: contactId, message });
      });
    }
  }, [contactId, sendMessage]);

  if (!contactId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Aucun ami sélectionné</Text>
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
        <Text>Aucun message. Commencez la conversation !</Text>
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
      onSend={onSend}
      user={{
        _id: user.uid,
        name: user.username || 'User',
        avatar: user.avatarUri || 'https://placeimg.com/140/140/any',
      }}
    />
  );
};

export default MessagesScreen;