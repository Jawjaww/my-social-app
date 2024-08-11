import '@emotion/react';

console.log("Theme module loaded");

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
    };
    inputHeight: number;
  }
}

// Define a global theme object for consistent styling across the app
export const theme = {
  colors: {
    primary: '#007AFF',        // Main primary color
    secondary: '#5856D6',      // Secondary accent color
    background: '#F2F2F7',     // Background color
    text: '#000000',           // Primary text color
    textSecondary: '#8E8E93',  // Secondary text color
    error: '#FF3B30',          // Error messages
    success: '#34C759',        // Success messages
    link: '#007AFF',           // Link text color
    border: '#C7C7CC',         // Border color for input fields, etc.
    buttonBackground: '#007AFF', // Button background color
    buttonText: '#FFFFFF',     // Button text color
  },
  spacing: {
    xs: 4,    // Extra small spacing
    sm: 8,    // Small spacing
    md: 16,   // Medium spacing
    lg: 24,   // Large spacing
    xl: 32,   // Extra large spacing
    xxl: 48,  // Double extra large spacing
  },
  fontSizes: {
    small: 12,  // Small text size
    medium: 16, // Medium text size
    large: 20,  // Large text size
    xlarge: 24, // Extra large text size
    xxlarge: 28,// Double extra large text size
    link: 16,   // Link text size
  },
  borderRadius: {
    small: 4,   // Small border radius
    medium: 8,  // Medium border radius
    large: 16,  // Large border radius
  },
  inputHeight: 44, // Standard input height
};

console.log("Theme object:", theme);

export type AppTheme = typeof theme; // Export the type of the theme for type safety
