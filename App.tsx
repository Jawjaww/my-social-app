import React from "react";
import { View, ActivityIndicator } from "react-native";
import { RecoilRoot } from "recoil";
import Sentry from "./sentrySetup";
import { useAuthState } from "./app/authentication";
import RootStack from "./app/navigation/RootStack";

const App: React.FC = () => {
  const { loading } = useAuthState(); // Use the useAuthState hook to check if the user is loading

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
