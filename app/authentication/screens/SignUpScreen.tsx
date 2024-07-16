import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  UserCredential,
  AuthError,
  sendEmailVerification,
} from "firebase/auth";
import { app } from "../../../services/firebaseConfig";

interface SignUpScreenProps {
  navigation: any;
}

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
      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="S'inscrire" onPress={handleSignUp} />
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
});

export default SignUpScreen;
