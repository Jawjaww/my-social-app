import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { IMessage } from "../types/sharedTypes";
import { addMessage } from "./database";
import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_IDENTIFIER } from '@env';
import { PARSE_SERVER_URL, PARSE_APP_ID, PARSE_MASTER_KEY } from '@env';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(PARSE_APP_ID);
Parse.serverURL = PARSE_SERVER_URL;

export async function registerForPushNotificationsAsync() {
  const token = await messaging().getToken();
  
  if (token) {
    console.log("FCM Token:", token);
    const installation = new Parse.Installation();
    await installation.save({
      deviceType: Platform.OS,
      deviceToken: token,
      pushType: 'fcm',
      appIdentifier: APP_IDENTIFIER,
      parseVersion: '5.4.0'
    });
    return token;
  }
  return null;
}

export function listenForNotifications(
  handleNotification: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(handleNotification);
}

export async function sendPushNotification(recipientId: string, message: any) {
  try {
    await Parse.Cloud.run('sendPush', {
      userId: recipientId,
      message: message
    });
  } catch (error) {
    console.error('Erreur envoi notification:', error);
    throw error;
  }
}

export function initializeMessaging() {
  messaging().onMessage(async (remoteMessage) => {
    if (remoteMessage.data?.type === "text_message") {
      const message: IMessage = {
        _id: remoteMessage.messageId || "",
        text: typeof remoteMessage.data.text === 'string' ? remoteMessage.data.text : '',
        createdAt: remoteMessage.sentTime ? remoteMessage.sentTime : Date.now(),
        user: typeof remoteMessage.data.user === "string" ? JSON.parse(remoteMessage.data.user) : remoteMessage.data.user,
        channelId: typeof remoteMessage.data.channelId === 'string' ? remoteMessage.data.channelId : '',
        sent: true,
        received: true,
      };
      await addMessage(message);
      // Dispatch une action Redux pour mettre à jour l'état des messages
      // store.dispatch(addMessage(message));
    } else if (remoteMessage.data?.type === "webrtc_signal") {
      console.log("WebRTC signal received:", remoteMessage.data.signal);
    }
  });
}

export async function sendMessage(recipientId: string, message: any) {
  const token = await messaging().getToken();
  if (token) {
    // 'send' method is not available on the messaging object
    // You will need to use another method to send the message, for example:
    return messaging().sendMessage({
      data: {
        type: "text_message",
        ...message,
      },
      to: token,
      fcmOptions: {}
    });
  } else {
    console.log("No token found");
  }
}

export async function sendWebRTCSignal(recipientId: string, signal: any) {
  const token = await messaging().getToken();
  if (token) {
    return sendPushNotification(recipientId, {
      type: "webrtc_signal",
      signal: signal,
    });
  }
}

export async function getFCMToken() {
  const token = await messaging().getToken();
  if (token) {
    console.log("FCM Token:", token);
    // Save the token in your database or send it to your server
  } else {
    console.warn("Failed to get FCM token");
  }
  return token;
}

// Add functions to subscribe and unsubscribe from notifications
export function subscribeToNotifications(handleNotification: (notification: Notifications.Notification) => void) {
  const subscription = Notifications.addNotificationReceivedListener(handleNotification);
  return () => subscription.remove();
}

export function subscribeToNotificationResponses(handleResponse: (response: Notifications.NotificationResponse) => void) {
  const subscription = Notifications.addNotificationResponseReceivedListener(handleResponse);
  return () => subscription.remove();
}
