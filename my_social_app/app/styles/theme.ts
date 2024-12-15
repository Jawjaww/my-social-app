import '@emotion/react';
import { ViewStyle } from 'react-native';
import { ElementType } from 'react';

// Extend Emotion's Theme interface to define our custom theme properties
declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      textSecondary: string;
      error: string;
      success: string;
      link: string;
      border: string;
      buttonBackground: string;
      buttonText: string;
      disabled: string;
      card: string;
      cardBackground: string;
      inputBackground: string;
      shadow: string;
    };
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    fontSizes: {
      small: number;
      medium: number;
      large: number;
      xlarge: number;
      xxlarge: number;
      link: number;
    };
    borderRadius: {
      small: number;
      medium: number;
      large: number;
      circular: number;
    };
    shadows: {
      small: {
        shadowColor: string;
        shadowOffset: { width: number; height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
      };
      medium: {
        shadowColor: string;
        shadowOffset: { width: number; height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
      };
    };
    inputHeight: number;
  }
}

// Define a global theme object for consistent styling across the app
export const theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    error: '#FF3B30',
    success: '#34C759',
    link: '#007AFF',
    border: '#C7C7CC',
    buttonBackground: '#007AFF',
    buttonText: '#FFFFFF',
    disabled: '#8E8E93',
    card: '#FFFFFF',
    cardBackground: '#F2F2F7',
    inputBackground: '#FFFFFF',
    shadow: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fontSizes: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
    xxlarge: 28,
    xxxlarge: 80,
    link: 16,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    circular: 100,
  },
  shadows: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
  inputHeight: 44,
};

export type AppTheme = typeof theme;