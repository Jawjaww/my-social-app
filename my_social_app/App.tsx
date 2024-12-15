import React, { useEffect, useState } from "react";
import { initializeStore } from "./app/store/store";
import * as SplashScreen from "expo-splash-screen";
import ErrorBoundary from "./app/components/ErrorBoundary";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/react-native";
import { enableScreens } from "react-native-screens";
import { SENTRY_DSN } from "@env";
import "intl-pluralrules";
import { I18nextProvider } from "react-i18next";
import i18n from "./app/i18n/i18n";
import AppNavigation from "./app/navigation/AppNavigation";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./app/styles/theme";
import { ToastProvider } from "./app/providers/ToastProvider";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styled from "@emotion/native";
import NotificationManager from "./app/providers/NotificationManager";
import { initializeParse } from "./app/config/parse";
import { initDatabase } from './app/services/database';
import { ActivityIndicator, View, Text } from 'react-native';

enableScreens();

// Initialize Parse
initializeParse();

Sentry.init({
  dsn: SENTRY_DSN,
  debug: false,
});

const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('🚀 Starting app initialization...');
        await SplashScreen.preventAutoHideAsync();
        console.log('✅ SplashScreen prevented from auto-hiding');
        
        // Initialize store
        console.log('📦 Initializing store...');
        const initializedStore = await initializeStore();
        setStore(initializedStore);
        console.log('✅ Store initialized');
        
        // Initialize database
        console.log('🗄️ Initializing database...');
        const db = await initDatabase();
        if (!db) {
          throw new Error("Failed to initialize database");
        }
        setDbInitialized(true);
        console.log('✅ Database initialized');

        console.log('🎬 Hiding splash screen...');
        await SplashScreen.hideAsync();
        console.log('✅ Splash screen hidden');
        
        setIsReady(true);
        console.log('✅ App initialization complete');
      } catch (error) {
        console.error("❌ Initialization error:", error);
        if (error instanceof Error) {
          console.error("❌ Error stack:", error.stack);
        }
        Sentry.captureException(error);
        setError(error instanceof Error ? error : new Error(String(error)));
      }
    };
    initialize();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  if (!isReady || !dbInitialized || !store) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <I18nextProvider i18n={i18n}>
            <SafeAreaProvider>
              <NavigationContainer>
                <ToastProvider>
                  <NotificationManager>
                    <SafeContainer>
                      <AppNavigation />
                    </SafeContainer>
                  </NotificationManager>
                </ToastProvider>
              </NavigationContainer>
            </SafeAreaProvider>
          </I18nextProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
