import * as SQLite from 'expo-sqlite/next';

let database: SQLite.SQLiteDatabase | null = null;

export const initializeSQLite = async () => {
  try {
    console.log('🔄 Initialisation de SQLite...');
    database = await SQLite.openDatabaseAsync('myapp.db');
    
    // Créer les tables nécessaires
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        channel_id TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        user TEXT NOT NULL
      );
    `);
    
    console.log('✅ SQLite initialisé avec succès');
    return database;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de SQLite:', error);
    throw error;
  }
};

export const getDatabase = () => {
  if (!database) {
    throw new Error('SQLite n\'est pas initialisé. Appelez initializeSQLite d\'abord.');
  }
  return database;
}; 