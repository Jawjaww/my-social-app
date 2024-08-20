import React from "react";
import ErrorBoundary from "./app/components/ErrorBoundary";
import "./env.d.ts";
import { Provider } from "react-redux";
import * as Sentry from "@sentry/react-native";
import { enableScreens } from "react-native-screens";
import { SENTRY_DSN } from "@env";
import "intl-pluralrules";
import { I18nextProvider } from "react-i18next";
import i18n from "./app/i18n/i18n";
import store from "./app/store/store.ts";
import AppNavigation from "./app/navigation/AppNavigation";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./app/styles/theme";
import { ToastProvider } from "./app/providers/ToastProvider";
import { NavigationContainer, LinkingOptions } from "@react-navigation/native";
import { RootStackParamList } from "./app/types/sharedTypes.ts";

enableScreens();

Sentry.init({
  dsn: SENTRY_DSN,
  debug: true, // Set to false in production
});

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['https://mysocialapp.expo.dev', 'mysocialapp://'],
  config: {
    screens: {
      Auth: {
        screens: {
          ResetPassword: 'reset-password',
        },
      },
      Main: {
        screens: {
          Profile: {
            screens: {
              VerifyNewEmail: 'verify-new-email',
            },
          },
        },
      },
      VerifyEmail: 'verify-email',
    },
  },
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={theme}>
            <ToastProvider>
              <NavigationContainer linking={linking}>
                <AppNavigation />
              </NavigationContainer>
            </ToastProvider>
          </ThemeProvider>
        </I18nextProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
