import axios from 'axios';

Parse.Cloud.define('sendPushNotification', async (request) => {
  const { userId, message } = request.params;

  const userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo('objectId', userId);

  const pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.matchesQuery('user', userQuery);

  try {
    await Parse.Push.send({
      where: pushQuery,
      data: {
        title: 'Nouvelle notification',
        alert: message,
      },
    }, { useMasterKey: true });

    return 'Notification envoyée avec succès';
  } catch (error) {
    throw `Erreur lors de l'envoi de la notification : ${error}`;
  }
});

Parse.Cloud.define('sendMessageNotification', async (request) => {
  const { recipientId, messageText } = request.params;

  const query = new Parse.Query(Parse.Installation);
  query.equalTo('userId', recipientId);

  try {
    await Parse.Push.send({
      where: query,
      data: {
        title: 'Nouveau message',
        body: messageText,
        type: 'message',
        // Autres données si nécessaire
      },
    }, { useMasterKey: true });
    return 'Notification sent successfully';
  } catch (error) {
    throw `Error sending notification: ${error.message}`;
  }
});

Parse.Cloud.define('sendCallNotification', async (request) => {
  const { recipientId, callId } = request.params;

  const query = new Parse.Query(Parse.Installation);
  query.equalTo('userId', recipientId);

  try {
    await Parse.Push.send({
      where: query,
      data: {
        title: 'Appel entrant',
        body: 'Vous recevez un appel vidéo',
        type: 'webrtc_call',
        callId: callId,
        // Autres données si nécessaire
      },
    }, { useMasterKey: true });
    return 'Notification sent successfully';
  } catch (error) {
    throw `Error sending notification: ${error.message}`;
  }
}); 