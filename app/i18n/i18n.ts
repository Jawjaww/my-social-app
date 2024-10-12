import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import fr from '../translations/fr.json';
import en from '../translations/en.json';

console.log('Initializing i18n...');
console.log('Device locale:', Localization.locale);

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    lng: Localization.locale.split('-')[0],
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    keySeparator: '.',
    nsSeparator: false,
  }, (err, t) => {
    if (err) console.error('i18n initialization error:', err);
    console.log('i18n initialized successfully');
    console.log('Current language:', i18n.language);
  });

export default i18n;