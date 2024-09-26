import React from "react";
import store, { persistor } from "./app/store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import * as SplashScreen from "expo-splash-screen";
import ErrorBoundary from "./app/components/ErrorBoundary";
import "./env.d.ts";
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
import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { RootStackParamList } from "./app/types/sharedTypes.ts";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import styled from "@emotion/native";
import { useState, useEffect } from "react";

// Prevent the splash screen from automatically hiding
SplashScreen.preventAutoHideAsync();

enableScreens();

Sentry.init({
  dsn: SENTRY_DSN,
  debug: true, // Set to false in production
});

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["https://mysocialapp.expo.dev", "mysocialapp://"],
  config: {
    screens: {
      Auth: {
        path: "auth",
        parse: {
          mode: (mode: string) => mode,
          oobCode: (oobCode: string) => oobCode,
        },
        screens: {
          VerifyEmail: "verify-email",
          ResetPassword: "reset-password",
        },
      },
      Main: {
        screens: {
          Profile: {
            screens: {
              VerifyNewEmail: "verify-new-email",
            },
          },
        },
      },
    },
  },
};

const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const App: React.FC = () => {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    const initI18n = async () => {
      await i18n.init();
      setIsI18nInitialized(true);
    };
    initI18n();
  }, []);

  if (!isI18nInitialized) {
    return null; 
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <SafeAreaProvider>
              <SafeContainer>
                <I18nextProvider i18n={i18n}>
                  <ToastProvider>
                    <NavigationContainer linking={linking}>
                      <AppNavigation />
                    </NavigationContainer>
                  </ToastProvider>
                </I18nextProvider>
              </SafeContainer>
            </SafeAreaProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;