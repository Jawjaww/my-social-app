import { RecoilRoot } from 'recoil';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebaseconfig';
import AuthStack from './app/navigation/AuthStack';
import MainStack from './app/navigation/MainStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        AsyncStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        AsyncStorage.removeItem('currentUser');
      }
    });
    return unsubscribe; // Unsubscribe on unmount
  }, []);

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>;
  }

  return (
    <RecoilRoot>
      <NavigationContainer>
        {currentUser ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default App;