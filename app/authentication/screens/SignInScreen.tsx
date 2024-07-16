import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
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

interface SignInScreenProps {
  navigation: NavigationProp<any>;
}

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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Se connecter" onPress={handleSignIn} />
      <Text style={styles.link} onPress={() => navigation.navigate("SignUp")}>
        Pas de compte ? S'inscrire
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  error: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  link: {
    color: "blue",
    marginTop: 20,
    textAlign: "center",
  },
});

export default SignInScreen;
