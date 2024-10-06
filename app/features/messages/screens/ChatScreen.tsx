import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectUser } from "../../authentication/authSelectors";
import {
  useGetContactProfileQuery,
  useUpdateContactNotificationTokenMutation,
} from "../../../services/api";
import { ContactsStackParamList } from "../../../types/sharedTypes";
import {
  sendPushNotification,
  listenForNotifications,
} from "../../../services/fcmService";
import ContactInfoHeader from "../../../components/ContactInfoHeader";

type ChatScreenRouteProp = RouteProp<ContactsStackParamList, "Chat">;

const ChatScreen: React.FC = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const { contactUid } = route.params;
  const user = useSelector(selectUser);
  const { data: contact } = useGetContactProfileQuery(contactUid);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [updateContactToken] = useUpdateContactNotificationTokenMutation();

  useEffect(() => {
    if (!user) return;

    const subscription = listenForNotifications((notification) => {
      if (notification.request.content.data?.senderId === contactUid) {
        const newMessage = notification.request.content.data?.message;
        if (typeof newMessage === "string") {
          const parsedMessage: IMessage = JSON.parse(newMessage);
          setMessages((prevMessages) =>
            GiftedChat.append(prevMessages, [parsedMessage])
          );
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [user, contactUid]);

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      if (user && contact) {
        const [message] = newMessages;
        if (contact.notificationToken) {
          try {
            await sendPushNotification(contact.notificationToken, {
              type: "message",
              senderId: user.uid,
              message: JSON.stringify(message),
            });
          } catch (error) {
            console.error("Failed to send push notification:", error);
            if (
              error instanceof Error &&
              error.message.includes("InvalidToken")
            ) {
              // Marquer le token comme invalide dans la base de données
              await updateContactToken({
                contactUid: contact.contactUid,
                token: "",
              });
            }
          }
        } else {
          console.warn("Contact does not have a notification token");
        }
        setMessages((prevMessages) =>
          GiftedChat.append(prevMessages, newMessages)
        );
      }
    },
    [user, contact, updateContactToken]
  );

  return (
    <View style={styles.container}>
      <ContactInfoHeader
        contactUid={contactUid}
        onInfoPress={() => {
          // Navigate to contact details
        }}
      />
      {user && (
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: user.uid }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;
