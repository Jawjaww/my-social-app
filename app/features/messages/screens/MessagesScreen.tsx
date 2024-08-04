import React, { useCallback } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery, useSendMessageMutation } from '../../../services/api';
import { selectUser } from '../../authentication/authSelectors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MainTabParamList } from '../../../navigation/navigationTypes';

interface Props {
  navigation: NativeStackNavigationProp<MainTabParamList, 'Message'>;
  route: RouteProp<MainTabParamList, 'Message'>;
}

const MessagesScreen: React.FC<Props> = ({ navigation, route }) => {
  const friendId = route.params?.friendId;
  const user = useSelector(selectUser);
  const { data: messages, isLoading } = useGetMessagesQuery(friendId ?? '');
  const [sendMessage] = useSendMessageMutation();

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    if (friendId) {
      newMessages.forEach((message) => {
        sendMessage({ userId: friendId, message });
      });
    }
  }, [friendId, sendMessage]);

  if (!friendId) {
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

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: user.uid,
        name: user.displayName || 'User',
        avatar: user.photoURL || 'https://placeimg.com/140/140/any',
      }}
    />
  );
};

export default MessagesScreen;