import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/authentication/authSelectors';
import { selectProfile } from '../features/profile/profileSelectors';
import { Persistor } from 'redux-persist';
import * as SplashScreen from 'expo-splash-screen';

export const useAppInitialization = (persistor: Persistor) => {
  const [isReady, setIsReady] = useState(false);
  const user = useSelector(selectUser);
  const profile = useSelector(selectProfile);

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("1. Starting initialization");
        await SplashScreen.preventAutoHideAsync();

        console.log("2. Waiting for Redux Persist");
        await new Promise<void>((resolve) => {
          const unsubscribe = persistor.subscribe(() => {
            const { bootstrapped } = persistor.getState();
            if (bootstrapped) {
              unsubscribe();
              console.log("3. Redux Persist rehydrated");
              resolve();
            }
          });
        });

        console.log("4. Checking user and profile");
        console.log("User:", user);
        console.log("Profile:", profile);

        // Simulating a delay to ensure we see the logs
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log("5. Initialization complete");
        setIsReady(true);

        await SplashScreen.hideAsync();
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };

    initialize();
  }, [persistor, user, profile]);

  return isReady;
};