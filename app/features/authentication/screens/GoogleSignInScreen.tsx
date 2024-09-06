import React, { useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri, ResponseType } from 'expo-auth-session';
import { GOOGLE_CLIENT_ID } from '@env';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { useSignInWithGoogleMutation } from '../../../services/api';
import { useSelector } from 'react-redux';
import { selectUser } from '../authSelectors';
import {
  CenteredContainer,
  Container,
  Button,
  ButtonText,
  Card,
  CardText
} from "../../../components/StyledComponents";
import { Ionicons } from '@expo/vector-icons';
import { theme } from "../../../styles/theme";

WebBrowser.maybeCompleteAuthSession();

const GoogleSignIn: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const [signInWithGoogle, { isLoading }] = useSignInWithGoogleMutation();

  const redirectUri = makeRedirectUri({
    native: 'https://mysocialapp.expo.dev',
  });

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    responseType: ResponseType.IdToken,
    scopes: ['profile', 'email'],
    redirectUri,
  });

  const handleGoogleSignIn = useCallback(async () => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      try {
        await signInWithGoogle(id_token).unwrap();
      } catch (error) {
        console.error('Error during Google Sign-In:', error);
      }
    }
  }, [response, signInWithGoogle]);

  useEffect(() => {
    handleGoogleSignIn();
  }, [handleGoogleSignIn]);

  return (
      <CenteredContainer>
        <Container>
          <Button
            onPress={() => promptAsync()}
            disabled={!request || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.buttonText} />
            ) : (
              <ButtonText>{t('googleSignIn.button')}</ButtonText>
            )}
          </Button>
          {user && (
            <Card>
              <Ionicons name="person" size={24} color={theme.colors.primary} />
              <CardText>{t('googleSignIn.loggedInAs')}</CardText>
              <CardText>{user.email}</CardText>
            </Card>
          )}
        </Container>
      </CenteredContainer>
  );
};

export default GoogleSignIn;