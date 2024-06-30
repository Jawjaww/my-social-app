import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { RecoilRoot, useRecoilState } from 'recoil';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseconfig';
import AuthStack from './app/navigation/AuthStack';
import MainStack from './app/navigation/MainStack';
import { userState } from './app/recoil/authAtoms';

function App() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe; // Unsubscribe on unmount
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function () {
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );
}
