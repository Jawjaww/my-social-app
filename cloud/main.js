Parse.Cloud.define('testPush', async (request) => {
  try {
    console.log('Testing push notification');
    
    const result = await Parse.Push.send({
      where: new Parse.Query(Parse.Installation),
      data: {
        alert: "Test de notification",
        title: "Test",
        badge: 1
      }
    }, { useMasterKey: true });
    
    console.log('Push sent successfully:', result);
    return { success: true };
    
  } catch (error) {
    console.error('Push notification failed:', error);
    throw error;
  }
}); 