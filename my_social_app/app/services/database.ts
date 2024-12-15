import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import * as Sentry from "@sentry/react-native";
import { IMessage, MessageRow } from '../types/sharedTypes';

let db: SQLite.Database | null = null;

export const initDatabase = async (): Promise<SQLite.Database> => {
  try {
    if (db) {
      return db;
    }

    console.log('Initializing database...');
    
    db = SQLite.openDatabase('messages.db');
    
    return new Promise<SQLite.Database>((resolve, reject) => {
      db!.transaction((tx: SQLite.SQLTransaction) => {
        tx.executeSql(`
          CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            channel_id TEXT NOT NULL,
            text TEXT NOT NULL,
            created_at INTEGER NOT NULL,
            user TEXT NOT NULL,
            type TEXT,
            payload TEXT
          );
        `);
        tx.executeSql(`
          CREATE INDEX IF NOT EXISTS idx_channel_id ON messages(channel_id);
        `);
      }, 
      (error: SQLite.SQLError) => {
        console.error('❌ Error initializing database:', error);
        Sentry.captureException(error);
        reject(error);
      },
      () => {
        console.log('✅ Database initialized successfully');
        resolve(db!);
      });
    });
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    Sentry.captureException(error);
    throw error;
  }
};

export const getDatabase = async (): Promise<SQLite.Database> => {
  if (!db) {
    await initDatabase();
  }
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

export const addMessage = async (message: IMessage): Promise<void> => {
  try {
    const database = await getDatabase();
    
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `INSERT OR REPLACE INTO messages (id, channel_id, text, created_at, user, type, payload) 
           VALUES (?, ?, ?, ?, ?, ?, ?);`,
          [
            message._id,
            message.channelId,
            message.text,
            message.createdAt instanceof Date ? message.createdAt.getTime() : message.createdAt,
            JSON.stringify(message.user),
            message.type || null,
            message.payload ? JSON.stringify(message.payload) : null
          ],
          () => resolve(),
          (_, error) => {
            console.error('Error adding message:', error);
            Sentry.captureException(error);
            reject(error);
            return false;
          }
        );
      });
    });
  } catch (error) {
    console.error('Error in addMessage:', error);
    Sentry.captureException(error);
    throw error;
  }
};

export const getMessages = async (channelId: string): Promise<IMessage[]> => {
  const database = await getDatabase();
  
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM messages WHERE channel_id = ? ORDER BY created_at DESC;`,
        [channelId],
        (_, { rows: { _array } }) => {
          const messages = _array.map((row: MessageRow) => ({
            _id: row.id,
            channelId: row.channel_id,
            text: row.text,
            createdAt: new Date(row.created_at),
            user: JSON.parse(row.user),
            type: row.type as 'offer' | 'answer' | 'candidate' | undefined,
            payload: row.payload ? JSON.parse(row.payload) : undefined
          }));
          resolve(messages);
        },
        (_, error) => {
          console.error('Error getting messages:', error);
          Sentry.captureException(error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteMessages = async (channelId: string, messageIds: string[]): Promise<void> => {
  try {
    const database = await getDatabase();
    const placeholders = messageIds.map(() => '?').join(',');
    
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `DELETE FROM messages WHERE channel_id = ? AND id IN (${placeholders})`,
          [channelId, ...messageIds],
          () => resolve(),
          (_, error) => {
            console.error('Error deleting messages:', error);
            Sentry.captureException(error);
            reject(error);
            return false;
          }
        );
      });
    });
  } catch (error) {
    console.error('Error in deleteMessages:', error);
    Sentry.captureException(error);
    throw error;
  }
};
