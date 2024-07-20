import React, { useEffect } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { RecoilRoot } from "recoil";
import * as Updates from 'expo-updates';
import Sentry from "./sentrySetup";
import { useAuthState } from "./app/authentication";
import RootStack from "./app/navigation/RootStack";

const App: React.FC = () => {
  const { loading } = useAuthState();

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            "Mise à jour disponible",
            "Une nouvelle version de l'application a été téléchargée. Voulez-vous redémarrer l'application pour l'appliquer ?",
            [
              { text: "Annuler", style: "cancel" },
              { text: "Redémarrer", onPress: () => Updates.reloadAsync() }
            ]
          );
        }
      } catch (error) {
        console.error("Erreur lors de la vérification des mises à jour :", error);
      }
    };

    checkForUpdates();
  }, []);

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