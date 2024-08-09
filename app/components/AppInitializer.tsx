import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setLoading } from '../features/authentication/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BootScreen from '../features/boot/screens/BootScreen';

const AppInitializer: React.FC<{ onInitializationComplete: () => React.ReactNode }> = ({ onInitializationComplete }) => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      const startTime = Date.now();
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          dispatch(setUser(JSON.parse(user)));
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        dispatch(setLoading(false));
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(500 - elapsedTime, 0);
        setTimeout(() => {
          setIsInitialized(true);
        }, remainingTime);
      }
    };

    initializeApp();
  }, [dispatch]);

  return isInitialized ? onInitializationComplete() : <BootScreen />;
};

export default AppInitializer;