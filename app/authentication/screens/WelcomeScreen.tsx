import React from 'react';
import { Button } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigationTypes';
import styled from '@emotion/native';
import { useTranslation } from 'react-i18next';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Header = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const IntroText = styled.Text`
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  margin-bottom: 20px;
`;

const FooterText = styled.Text`
  font-size: 14px;
  text-align: center;
  color: gray;
`;

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  return (
    <Container>
      <Header>{t('welcome.title')}</Header>
      <IntroText>{t('welcome.intro')}</IntroText>

      <ButtonContainer>
        <Button
          title={t('welcome.signIn')}
          onPress={() => navigation.navigate('SignIn')}
        />
        <Button
          title={t('welcome.signUp')}
          onPress={() => navigation.navigate('SignUp')}
        />
        <Button
          title={t('welcome.googleSignIn')}
          onPress={() => navigation.navigate('GoogleSignIn')}
        />
      </ButtonContainer>

      <FooterText>{t('welcome.footer')}</FooterText>
    </Container>
  );
};

export default WelcomeScreen;