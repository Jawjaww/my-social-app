import { useState, useEffect } from 'react';
import { initDatabase } from '../services/database';
import * as Sentry from "@sentry/react-native";

export const useDatabase = () => {
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        console.log('🔄 Initialisation de la base de données...');
        await initDatabase();
        console.log('✅ Base de données initialisée avec succès');
        setIsDbInitialized(true);
      } catch (err) {
        console.error('❌ Erreur lors de l\'initialisation de la base de données:', err);
        setError(err as Error);
        Sentry.captureException(err);
      }
    };

    initializeDb();
  }, []);

  return { isDbInitialized, error };
}; 