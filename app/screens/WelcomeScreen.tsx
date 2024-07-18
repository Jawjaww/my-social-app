import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootStack';
import styled from '@emotion/native';

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

  return (
    <Container>
      <Header>Bienvenue sur ChatApp!</Header>
      <IntroText>
        Découvrez les meilleures façons de rester connecté avec vos amis et votre famille.
      </IntroText>

      <ButtonContainer>
        <Button
          title="Se connecter"
          onPress={() => navigation.navigate('SignIn')}
        />
        <Button
          title="S'inscrire"
          onPress={() => navigation.navigate('SignUp')}
        />
        <Button
          title="Se connecter avec Google"
          onPress={() => navigation.navigate('GoogleSignIn')}
        />
      </ButtonContainer>

      <FooterText>
        Besoin d'aide? Visitez notre section support.
      </FooterText>
    </Container>
  );
};

export default WelcomeScreen;