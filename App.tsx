import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { RecoilRoot } from "recoil";
import * as Updates from 'expo-updates';
import Sentry from "./sentrySetup";
import { useAuthState } from "./app/authentication";
import RootStack from "./app/navigation/RootStack";

const App: React.FC = () => {
  const { loading } = useAuthState();
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        setIsUpdateAvailable(update.isAvailable);
      } catch (error) {
        console.error("Erreur lors de la vérification des mises à jour :", error);
      }
    };

    checkForUpdates();
  }, []);

  const handleUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      Alert.alert(
        "Mise à jour disponible",
        "Une nouvelle version de l'application a été téléchargée. L'application va redémarrer pour appliquer les changements.",
        [{ text: "OK", onPress: () => Updates.reloadAsync() }]
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      Alert.alert("Erreur", "Impossible de mettre à jour l'application. Veuillez réessayer plus tard.");
    }
  };

  useEffect(() => {
    if (isUpdateAvailable) {
      Alert.alert(
        "Mise à jour disponible",
        "Une nouvelle version de l'application est disponible. Voulez-vous la télécharger maintenant ?",
        [
          { text: "Plus tard", style: "cancel" },
          { text: "Mettre à jour", onPress: handleUpdate }
        ]
      );
    }
  }, [isUpdateAvailable]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <RootStack />;
};

const WrappedApp = Sentry.wrap(App);

export default function Root() {
  return (
    <RecoilRoot>
      <WrappedApp />
    </RecoilRoot>
  );
}