import React from 'react';
import { Text, Button } from 'react-native';
import { useSendVerificationEmail } from '../../hooks';
import { useReloadUser } from '../../hooks';
import { useRecoilState } from 'recoil';
import { userState } from '../recoil/authAtoms';
import styled from '@emotion/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

const Heading = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Instructions = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 20px;
`;

const VerifyEmailScreen: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [sendVerificationEmail, sending, sendError] = useSendVerificationEmail();
  const [reloadUser, reloading, reloadError] = useReloadUser();

  return (
    <Container>
      <Heading>Verify your email address</Heading>
      <Instructions>
        We have sent a verification email to {user?.email}. Please check your email and click on the verification link.
      </Instructions>
      {sendError && <ErrorText>Error sending verification email: {sendError.message}</ErrorText>}
      {reloadError && <ErrorText>Error reloading user: {reloadError.message}</ErrorText>}
      <Button title="Resend Verification Email" onPress={sendVerificationEmail} disabled={sending} />
      <Button title="I've Verified My Email" onPress={reloadUser} disabled={reloading} />
      <Button title="Cancel" onPress={() => setUser(null)} />
    </Container>
  );
};

export default VerifyEmailScreen;