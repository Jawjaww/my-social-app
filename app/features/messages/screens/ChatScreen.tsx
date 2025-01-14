import React, { useState, useEffect, useCallback, useMemo } from "react";
import { GiftedChat, IMessage as GiftedIMessage, Time } from "react-native-gifted-chat";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../authentication/authSelectors";
import { useGetMessagesQuery, useSendMessageMutation } from "../../../services/api";
import { ChatScreenProps, IMessage as AppIMessage } from "../../../types/sharedTypes";
import { addMessage as addMessageToRedux, setMessages } from "../messagesSlice";
import { RootState } from "../../../store/store";
import { addMessage, getMessages } from "../../../services/database";
import { selectMessagesByContactUid } from '../messagesSelectors';
import { ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { getLocales } from 'expo-localization';
import { selectProfile } from '../../profile/profileSelectors';
import { selectContacts } from '../../contacts/contactsSelectors';
import AvatarPhoto from '../../../components/AvatarPhoto';

const convertToGiftedMessage = (message: AppIMessage): GiftedIMessage => ({
  ...message,
  createdAt: new Date(message.createdAt),
});

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const { contactUid } = route.params;
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const contacts = useSelector(selectContacts);
  const contact = contacts[contactUid];
  const user = useSelector(selectUser);
  const messages = useSelector((state: RootState) => selectMessagesByContactUid(state, contactUid));
  const [isLoading, setIsLoading] = useState(true);
  const [sendMessage] = useSendMessageMutation();

  const userLocale = getLocales()[0];
  const dateLocale = userLocale.languageCode === 'fr' ? fr : enUS;

  const formatDate = (date: Date | number) => {
    return format(new Date(date), 'dd MMMM yyyy', { locale: dateLocale });
  };

  const formatTime = (date: Date | number) => {
    return format(new Date(date), 'HH:mm', { locale: dateLocale });
  };

  const memoizedMessages = useMemo(() => messages.map(convertToGiftedMessage), [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        console.log('Loading messages for contactUid:', contactUid);
        const storedMessages = await getMessages(contactUid);
        console.log('Stored messages:', JSON.stringify(storedMessages));
        dispatch(setMessages({ channelId: contactUid, messages: storedMessages }));
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();
  }, [contactUid, dispatch]);

  const onSend = useCallback(
    async (newMessages: GiftedIMessage[] = []) => {
      for (const message of newMessages) {
        const messageWithChannelId: AppIMessage = {
          ...message,
          _id: message._id.toString(),
          createdAt: message.createdAt instanceof Date ? message.createdAt.getTime() : message.createdAt,
          user: {
            ...message.user,
            _id: message.user._id.toString(),
            name: message.user.name || "Unknown"
          },
          channelId: contactUid
        };
        console.log('Sending message:', messageWithChannelId);
        dispatch(addMessageToRedux(messageWithChannelId));
        await addMessage(messageWithChannelId);
        await sendMessage({ userId: user?.uid || "", message: messageWithChannelId });
      }
    },
    [sendMessage, contactUid, user, dispatch]
  );

  const renderTime = (props: any) => {
    return (
      <Time
        {...props}
        timeFormat="HH:mm"
        timeTextStyle={{
          left: {
            color: 'black',
          },
          right: {
            color: 'white',
          },
        }}
        time={formatTime(props.currentMessage.createdAt)}
      />
    );
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <GiftedChat
      messages={memoizedMessages}
      onSend={(newMessages) => onSend(newMessages)}
      user={{
        _id: profile?.uid || "",
        name: profile?.username || "",
        avatar: profile?.avatarUrl ?? profile?.avatarUri ?? ''
      }}
      renderAvatar={(props) => (
        <AvatarPhoto
          size={36}
          avatarSource={props.currentMessage.user._id === profile?.uid
            ? profile?.avatarUrl ?? profile?.avatarUri
            : contact?.contactAvatarUrl
          }
          username={props.currentMessage.user._id === profile?.uid
            ? profile?.username
            : contact?.contactUsername
          }
        />
      )}
      renderTime={renderTime}
      dateFormat="DD MMMM YYYY"
      timeFormat="HH:mm"
      locale={userLocale.languageCode || 'en'}
    />
  );
};
  
export default ChatScreen;
