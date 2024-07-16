import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSendVerificationEmail } from '../hooks/useSendVerificationEmail';
import { useReloadUser } from '../hooks/useReloadUser';
import { useRecoilState } from 'recoil';
import { userState } from '../recoil/authAtoms';

const VerifyEmailScreen: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [sendVerificationEmail, sending, sendError] = useSendVerificationEmail();
  const [reloadUser, reloading, reloadError] = useReloadUser();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verify your email address</Text>
      <Text style={styles.instructions}>
        We have sent a verification email to {user?.email}. Please check your email and click on the verification link.
      </Text>
      {sendError && <Text style={styles.error}>Error sending verification email: {sendError.message}</Text>}
      {reloadError && <Text style={styles.error}>Error reloading user: {reloadError.message}</Text>}
      <Button title="Resend Verification Email" onPress={sendVerificationEmail} disabled={sending} />
      <Button title="I've Verified My Email" onPress={reloadUser} disabled={reloading} />
      <Button title="Cancel" onPress={() => setUser(null)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  instructions: { fontSize: 16, marginBottom: 20 },
  error: { color: 'red', marginBottom: 20 },
});

export default VerifyEmailScreen;
