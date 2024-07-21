import React from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styled from '@emotion/native';
import { MainTabParamList } from '../../navigation/navigationTypes';

const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const Message = styled.Text`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
`;

const BackButton = styled.TouchableOpacity`
  background-color: #007AFF;
  padding: 10px 20px;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

type VerifyNewEmailScreenRouteProp = RouteProp<MainTabParamList, 'VerifyNewEmail'>;
type VerifyNewEmailScreenNavigationProp = NativeStackNavigationProp<MainTabParamList, 'VerifyNewEmail'>;

/**
 * VerifyNewEmailScreen component
 * Displays a message to the user after they've requested an email change
 */
const VerifyNewEmailScreen: React.FC = () => {
  const navigation = useNavigation<VerifyNewEmailScreenNavigationProp>();
  const route = useRoute<VerifyNewEmailScreenRouteProp>();
  const { email } = route.params;

  return (
    <Container>
      <Message>
        A verification email has been sent to {email}. 
        Please check your inbox and click the verification link to complete the email change.
      </Message>
      <BackButton onPress={() => navigation.navigate('Profile')}>
        <ButtonText>Back to Profile</ButtonText>
      </BackButton>
    </Container>
  );
};

export default VerifyNewEmailScreen;