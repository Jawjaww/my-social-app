import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';

const FONT_URL = 'https://fonts.gstatic.com/s/orbitron/v15/yY8g1g8g1g8g1g8g1g8g1g8g.woff2'; // URL de la police Orbitron
const FONT_NAME = 'Orbitron';

export const loadCustomFont = async () => {
  const fontPath = `${FileSystem.cacheDirectory}${FONT_NAME}.ttf`;

  try {
    console.log('Checking if font exists...');
    const fontInfo = await FileSystem.getInfoAsync(fontPath);
    if (!fontInfo.exists) {
      console.log('Font not found, downloading...');
      await FileSystem.downloadAsync(FONT_URL, fontPath);
      console.log('Font downloaded successfully');
    } else {
      console.log('Font already exists');
    }

    return fontPath;
  } catch (error) {
    console.error('Error loading custom font:', error);
    return null;
  }
};