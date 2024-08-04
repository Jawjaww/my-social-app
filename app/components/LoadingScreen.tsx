import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const LoadingScreen: React.FC = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

export default LoadingScreen;