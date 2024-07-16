import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationSettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Préférences de notification</Text>
      {/* Add your notification settings UI here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default NotificationSettingsScreen;
