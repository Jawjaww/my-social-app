declare module 'react-native-deep-linking' {
    interface DeepLinking {
      addScheme(scheme: string): void;
      addRoute(route: string, callback: (response: { [key: string]: unknown }) => void): void;
      addEventListener(event: string, callback: (event: { url: string }) => void): { remove: () => void };
    }
  
    const DeepLinking: DeepLinking;
    export default DeepLinking;
  }