
declare module 'firebase/auth/react-native' {
    import AsyncStorage from '@react-native-async-storage/async-storage';
    export function getReactNativePersistence(storage: typeof AsyncStorage): any;
}