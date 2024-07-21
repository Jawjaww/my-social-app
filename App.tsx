import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { RecoilRoot } from "recoil";
import * as Updates from 'expo-updates';
import * as Sentry from "@sentry/react-native";
import { useAuth } from "./app/hooks";
import RootStack from "./app/navigation/RootStack";
import { enableScreens } from 'react-native-screens';

// Enable native screens for performance optimization
enableScreens();

const App: React.FC = () => {
  const { loading } = useAuth();
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      if (__DEV__) {
        console.log("Update check disabled in development mode");
        return;
      }
      try {
        const update = await Updates.checkForUpdateAsync();
        setIsUpdateAvailable(update.isAvailable);
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    };
    checkForUpdates();
  }, []);

  const handleUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      Alert.alert(
        "Update available",
        "A new version of the app has been downloaded. The app will restart to apply the changes.",
        [{ text: "OK", onPress: () => Updates.reloadAsync() }]
      );
    } catch (error) {
      console.error("Error updating app:", error);
      Alert.alert("Error", "Unable to update the app. Please try again later.");
    }
  };

  useEffect(() => {
    if (isUpdateAvailable) {
      Alert.alert(
        "Update available",
        "A new version of the app is available. Would you like to download it now?",
        [
          { text: "Later", style: "cancel" },
          { text: "Update", onPress: handleUpdate }
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
