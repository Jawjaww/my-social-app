import React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import AuthStack from './app/navigation/AuthStack';
import MainStack from './app/navigation/MainStack';
import { userAuthState } from './app/recoil/authAtoms';
import RootStack from './app/navigation/RootStack';

function AppContent() {
  const { state, contents } = useRecoilValueLoadable(userAuthState);

  if (state === 'loading') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {contents.user ? <RootStack /> : <MainStack />}    </NavigationContainer>
  );
}

export default AppContent;