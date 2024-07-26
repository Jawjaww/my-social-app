import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { RecoilRoot, useRecoilState } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { useAuth } from './app/hooks';
import RootStack from './app/navigation/RootStack';
import { userState } from './app/authentication/recoil/authAtoms';
import { enableScreens } from 'react-native-screens';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseConfig';
import { SENTRY_DSN } from '@env';
import { I18nextProvider } from 'react-i18next'; 
import i18n from './app/i18n/i18n'; 

// Enable native screens for performance optimization
enableScreens();

// Initialize Sentry
Sentry.init({
  dsn: SENTRY_DSN,
  debug: true, // Set to false in production
});

const App: React.FC = () => {
  const [_user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(true);
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const appUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified || false,
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Unsubscribe when component unmounts
  }, []);

  if (loading || authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const linking = {
    prefixes: ['https://mysocialapp.expo.dev'],
    config: {
      screens: {
        ResetPassword: 'resetPassword/:token',
        VerifyEmail: 'verifyEmail/:token',
        // Add others screen here
      },
    },
  };

  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer linking={linking}>
        <RootStack />
      </NavigationContainer>
    </I18nextProvider>
  );
};

const WrappedApp = Sentry.wrap(App);

export default function Root() {
  return (
    <RecoilRoot>
      <WrappedApp />
    </RecoilRoot>
  );
}