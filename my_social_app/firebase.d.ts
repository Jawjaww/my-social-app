// Firebase App types
declare module 'firebase/app' {
    import type { FirebaseApp, FirebaseOptions } from '@firebase/app-types';
    
    export function initializeApp(options: FirebaseOptions, name?: string): FirebaseApp;
    export function getApp(name?: string): FirebaseApp;
    export function getApps(): FirebaseApp[];
}

// Firebase Auth types
declare module 'firebase/auth' {
    import type { Auth as FirebaseAuth } from '@firebase/auth-types';
    export * from '@firebase/auth-types';
    export function getAuth(): FirebaseAuth;
}

// React Native persistence
declare module 'firebase/auth/react-native' {
    import type { Persistence } from '@firebase/auth-types';
    import type AsyncStorage from '@react-native-async-storage/async-storage';
    
    export function getReactNativePersistence(storage: typeof AsyncStorage): Persistence;
}

// Type guard pour les erreurs Firebase
export function isFirebaseError(error: unknown): error is {
    code: string;
    message: string;
    name: string;
} {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        'message' in error &&
        'name' in error
    );
}