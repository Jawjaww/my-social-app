import React, { useState } from "react";
import { Text, Button } from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
  AuthError,
  sendEmailVerification,
} from "firebase/auth";
import { app } from "../../../services/firebaseConfig";
import styled from '@emotion/native';

interface SignUpScreenProps {
  navigation: any;
}

const Container = styled.View`
  flex: 1;
  padding: 20px;
  justify-content: center;
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
  margin-bottom: 20px;
  text-align: center;
`;

function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const auth = getAuth(app);

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials: UserCredential) => {
        console.log("Compte créé :", userCredentials.user?.email);
        sendEmailVerification(userCredentials.user)
          .then(() => {
            console.log("Email de vérification envoyé.");
            navigation.navigate("SignIn");
          })
          .catch((error: AuthError) => {
            console.error(
              "Erreur lors de l'envoi de l'email de vérification :",
              error
            );
            setError(error.message);
          });
      })
      .catch((error: AuthError) => {
        setError(error.message);
      });
  };

  return (
    <Container>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        placeholder="Mot de passe"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Input
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
      {error ? <ErrorText>{error}</ErrorText> : null}
      <Button title="S'inscrire" onPress={handleSignUp} />
    </Container>
  );
}

export default SignUpScreen;