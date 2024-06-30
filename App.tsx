import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { RecoilRoot, useRecoilState } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseconfig';
import AuthStack from './app/navigation/AuthStack';
import MainStack from './app/navigation/MainStack';
import { userState } from './app/recoil/authAtoms';

const App: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const appUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(appUser);
      } else {
        // No user is signed in
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Unsubscribe when component unmounts
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
};

export default function () {
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );
}
