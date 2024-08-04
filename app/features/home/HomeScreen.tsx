import React from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/native';
import { useTranslation } from 'react-i18next';
import { selectUser } from '../authentication/authSelectors';

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Header = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const WelcomeText = styled.Text`
  font-size: 18px;
  text-align: center;
`;

const HomeScreen: React.FC = () => {
  const user = useSelector(selectUser);
  const { t } = useTranslation();

  return (
    <Container>
      <Header>{t('home.title')}</Header>
      <WelcomeText>
        {user ? t('home.welcomeUser', { email: user.email }) : t('home.welcome')}
      </WelcomeText>
    </Container>
  );
};

export default HomeScreen;