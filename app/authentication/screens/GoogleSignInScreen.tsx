import React, { useEffect, useCallback } from 'react';
import { View, Button, StyleSheet, Text, Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri, ResponseType } from 'expo-auth-session';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../../services/firebaseConfig';
import { GOOGLE_CLIENT_ID } from '@env';
import * as WebBrowser from 'expo-web-browser';
import { useRecoilState } from 'recoil';
import { userState } from '../recoil/authAtoms';

WebBrowser.maybeCompleteAuthSession();

const GoogleSignIn: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);

  const redirectUri = makeRedirectUri({
    native: Platform.OS === 'ios' ? 'mysocialapp://redirect' : 'http://localhost:8081',
  });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    responseType: ResponseType.IdToken,
    scopes: ['profile', 'email'],
    redirectUri,
  });

  const loginToFirebase = useCallback(async (idToken: string) => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const signInResponse = await signInWithCredential(auth, credential);
      const appUser = {
        uid: signInResponse.user.uid,
        email: signInResponse.user.email,
        displayName: signInResponse.user.displayName,
        photoURL: signInResponse.user.photoURL,
        emailVerified: signInResponse.user.emailVerified,
      };
      setUser(appUser);
    } catch (error) {
      console.error('Error logging in with Firebase:', error);
    }
  }, [setUser]);

  useEffect(() => {
    console.log('Response:', response);
    if (response?.type === 'success') {
      const { id_token } = response.params;
      console.log('ID Token:', id_token);
      loginToFirebase(id_token);
    } else if (response?.type === 'error') {
      console.error('Error during Google Sign-In:', response.error);
    }
  }, [response, loginToFirebase]);

  return (
    <View style={styles.container}>
      <Button
        title="Sign in with Google"
        disabled={!request}
        onPress={() => {
          console.log('Prompting Google Sign-In');
          promptAsync();
        }}
      />
      {user ? (
        <>
          <Button title="Logout" onPress={() => auth.signOut().then(() => setUser(null))} />
          <Text>Logged in as:</Text>
          <Text>{user.displayName}</Text>
          <Text>{user.email}</Text>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GoogleSignIn;
