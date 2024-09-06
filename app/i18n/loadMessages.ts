// import { Platform } from 'react-native';

// Determine path of translation files based on the platform in english
const getTranslationFilePath = (locale: string) => {
  return `./translations/${locale}.json`;
};

// Load translation messages dynamically
export const loadMessages = async (locale: string) => {
  try {
    const response = await fetch(getTranslationFilePath(locale));
    if (!response.ok) {
      throw new Error(`Failed to load translations for locale: ${locale}`);
    }
    const messages = await response.json();
    return messages;
  } catch (error) {
    console.error(error);
    return {}; // Return an empty object in case of error
  }
};
