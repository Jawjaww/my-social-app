import { Linking } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';

let navigationRef: NavigationContainerRef<any> | null = null;

/**
 * Sets the navigation reference for the navigation container.
 * @param ref The navigation container reference.
 */
export const setNavigationRef = (ref: NavigationContainerRef<any> | null) => {
  navigationRef = ref;
};

/**
 * Handles deep linking URLs related to the profile functionality.
 * Navigates to the 'EmailVerifiedScreen' upon email verification.
 * @param url The deep linking URL.
 */
export const handleProfileDeepLink = (url: string) => {
  if (url === 'my-social-app://email-verified') {
    if (navigationRef) {
      navigationRef.navigate('EmailVerifiedScreen');
      // Optionally show an alert or toast to confirm email change
    }
  }
};

/**
 * Sets up deep linking event listener for profile-related URLs.
 */
export const setupProfileDeepLinking = () => {
  Linking.addEventListener('url', ({ url }) => handleProfileDeepLink(url));
}
