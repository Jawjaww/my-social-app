import React from 'react';
import ErrorBoundary from './app/components/ErrorBoundary';
import './env.d.ts';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/react-native';
import { enableScreens } from 'react-native-screens';
import { SENTRY_DSN } from '@env';
import 'intl-pluralrules'; 
import { I18nextProvider } from 'react-i18next'; 
import i18n from './app/i18n/i18n';
import store from './app/store';
import AppNavigation from './app/navigation/AppNavigation';

enableScreens();

Sentry.init({
  dsn: SENTRY_DSN,
  debug: true, // Set to false in production
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <AppNavigation />
        </I18nextProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;