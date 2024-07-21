import React, { useState } from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from '@emotion/native';
import useUpdateEmail from '../../hooks/useUpdateEmail';
import Toast from '../../components/Toast';
import { MainTabParamList } from '../../navigation/navigationTypes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Styled components for screen layout
const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
`;

const Header = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Input = styled.TextInput`
  height: 40px;
  border-color: gray;
  border-width: 1px;
  margin-bottom: 20px;
  padding-horizontal: 10px;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
`;

// Type for screen props using native stack
type Props = NativeStackScreenProps<MainTabParamList, 'EditEmail'>;

/**
 * EditEmailScreen component
 * Allows users to update their email address
 */
const EditEmailScreen: React.FC<Props> = ({ navigation }) => {
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { updateEmailInFirebase, error, success } = useUpdateEmail();

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUpdateEmail = async () => {
    // Reset local error
    setLocalError('');

    // Validate inputs
    if (newEmail !== confirmEmail) {
      setLocalError("Emails do not match.");
      return;
    }
    if (!isValidEmail(newEmail)) {
      setLocalError("Invalid email format.");
      return;
    }
    if (!password) {
      setLocalError("Password is required.");
      return;
    }

    const result = await updateEmailInFirebase(newEmail, password);
    if (result) {
      navigation.navigate('VerifyNewEmail', { email: newEmail });
    } else {
      // Display error from useUpdateEmail hook
      Toast({ message: error || "Failed to update email", type: "error" });
    }
  };

  return (
    <Container>
      <Header>Edit Email</Header>
      <Input
        placeholder="New email"
        value={newEmail}
        onChangeText={setNewEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Confirm new email"
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Current password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {localError && <ErrorText>{localError}</ErrorText>}
      <Button title="Update Email" onPress={handleUpdateEmail} />
    </Container>
  );
};

export default EditEmailScreen;