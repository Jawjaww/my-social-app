import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import AuthStack from './app/navigation/AuthStack';
import MainStack from './app/navigation/MainStack'; // Correctly import MainStack
import { userAuthState } from './app/recoil/authAtoms';

const AppContent: React.FC = () => {
  // Specifying the explicit type for userAuthLoadable using a type assertion
  const userAuthLoadable = useRecoilValue(userAuthState) as { user: any; loading: boolean } | Promise<any>;

  useEffect(() => {
    const subscription = userAuthLoadable instanceof Promise ? null : () => {/* unsubscribe logic here */};
    return () => {
      if (subscription) {
        subscription();
      }
    };
  }, [userAuthLoadable]);

  if (userAuthLoadable instanceof Promise || userAuthLoadable.loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userAuthLoadable.user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppContent;
