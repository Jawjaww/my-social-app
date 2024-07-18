import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
  AuthError,
} from "firebase/auth";
import { app } from "../../../services/firebaseConfig";
import { NavigationProp } from "@react-navigation/native";
import { useRecoilState } from "recoil";
import { userState } from "../../authentication/recoil/authAtoms";
import { AppUser } from "../authTypes";
import styled from '@emotion/native';

interface SignInScreenProps {
  navigation: NavigationProp<any>;
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

const LinkText = styled.Text`
  color: blue;
  margin-top: 20px;
  text-align: center;
`;

function SignInScreen({ navigation }: SignInScreenProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const auth = getAuth(app);
  const [user, setUser] = useRecoilState(userState);

  const handleSignIn = () => {
    console.log("Attempting to sign in with:", email);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials: UserCredential) => {
        console.log("Signed in with:", userCredentials.user?.email);
        console.log("User before setting state:", userCredentials.user);
        const appUser: AppUser = {
          uid: userCredentials.user.uid,
          email: userCredentials.user.email,
          displayName: userCredentials.user.displayName,
          photoURL: userCredentials.user.photoURL,
          emailVerified: userCredentials.user.emailVerified,
        };
        setUser(appUser);
        console.log("User state updated:", appUser);
        navigation.navigate("MainTabs", { screen: "Profile" });
      })
      .catch((error: AuthError) => {
        console.error("Error signing in:", error);
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
      {error ? <ErrorText>{error}</ErrorText> : null}
      <Button title="Se connecter" onPress={handleSignIn} />
      <LinkText onPress={() => navigation.navigate("SignUp")}>
        Pas de compte ? S'inscrire
      </LinkText>
    </Container>
  );
}

export default SignInScreen;