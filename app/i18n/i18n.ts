import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from '../translations/fr.json';
import en from '../translations/en.json';
i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    lng: 'fr', // By default, the app will use French
    fallbackLng: 'fr', // If the user's language is not supported, the app will use English
    interpolation: {
      escapeValue: false, // React does not require escaping
    },
    react: {
      useSuspense: false, // Disable suspense to avoid loading issues
    },
    keySeparator: false, // Disable key separator
    nsSeparator: false, // Disable namespace separator
  });

export default i18n;