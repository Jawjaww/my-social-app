import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { IMessage } from "../types/sharedTypes";
import { addMessage } from "./database";

export async function registerForPushNotificationsAsync() {
  let token;

  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.warn("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.log("Push notifications are not available on emulator/simulator");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export function listenForNotifications(
  handleNotification: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(handleNotification);
}

export async function sendPushNotification(
  expoPushToken: string,
  message: any
) {
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: "default",
      data: message,
    }),
  });

  return response;
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
    // La méthode 'send' n'existe pas sur l'objet messaging
    // Vous devrez utiliser une autre méthode pour envoyer le message, par exemple :
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
    // Enregistrez le token dans votre base de données ou envoyez-le à votre serveur
  } else {
    console.warn("Failed to get FCM token");
  }
  return token;
}

// Supprimer les écouteurs globaux
// Notifications.addNotificationReceivedListener(notification => {
//   console.log('Notification received:', notification);
//   // Gérez la notification ici
// });

// Notifications.addNotificationResponseReceivedListener(response => {
//   console.log('Notification response:', response);
//   // Gérez la réponse de l'utilisateur ici
// });

// Ajouter des fonctions pour s'abonner et se désabonner des notifications
export function subscribeToNotifications(handleNotification: (notification: Notifications.Notification) => void) {
  const subscription = Notifications.addNotificationReceivedListener(handleNotification);
  return () => subscription.remove();
}

export function subscribeToNotificationResponses(handleResponse: (response: Notifications.NotificationResponse) => void) {
  const subscription = Notifications.addNotificationResponseReceivedListener(handleResponse);
  return () => subscription.remove();
}
