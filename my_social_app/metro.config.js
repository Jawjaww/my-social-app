const { getDefaultConfig } = require('@expo/metro-config');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

// Get the default config from Expo
const defaultConfig = getDefaultConfig(__dirname);

// Apply Sentry config on top of the default config
const sentryConfig = getSentryExpoConfig(__dirname);

// Merge the default and Sentry configurations
const combinedConfig = {
  ...defaultConfig,
  ...sentryConfig,
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs'],
  },
};

module.exports = combinedConfig;