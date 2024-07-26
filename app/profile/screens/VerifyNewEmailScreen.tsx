import React from 'react';
import { Button } from 'react-native';
import { useAuthManagement } from '../../hooks';
import { useRecoilState } from 'recoil';
import { userState } from '../../authentication/recoil/authAtoms';
import styled from '@emotion/native';
import { useTranslation } from 'react-i18next';

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

const VerifyNewEmailScreen: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useRecoilState(userState);
  const { sendVerificationEmail, reloadUser, error: reloadError } = useAuthManagement();

  const handleSendVerificationEmail = () => {
    if (user) {
      sendVerificationEmail(user as any); // Cast to any to bypass type checking
    }
  };

  return (
    <Container>
      <Heading>{t('verifyEmail.title')}</Heading>
      <Instructions>
        {t('verifyEmail.instructions', { email: user?.email })}
      </Instructions>
      {reloadError && <ErrorText>{t('auth.error.emailNotVerified')}</ErrorText>}
      <Button title={t('verifyEmail.resendButton')} onPress={handleSendVerificationEmail} />
      <Button title={t('verifyEmail.verifiedButton')} onPress={reloadUser} />
      <Button title={t('common.cancel')} onPress={() => setUser(null)} />
    </Container>
  );
};

export default VerifyNewEmailScreen;