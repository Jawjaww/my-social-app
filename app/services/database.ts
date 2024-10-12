import { SQLiteDatabase, openDatabaseSync } from 'expo-sqlite/next';
import * as Sentry from '@sentry/react-native';
import { IMessage } from '../types/sharedTypes';

let db: SQLiteDatabase | null = null;

export const initDatabase = async () => {
  if (db) return;
  try {
    console.log('Initializing database...');
    db = openDatabaseSync('myapp.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        text TEXT,
        createdAt TEXT,
        user TEXT,
        channelId TEXT
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error creating table:', error);
    Sentry.captureException(error);
  }
};

export const addMessage = async (message: IMessage) => {
  if (!db) {
    console.error('Database not initialized');
    return;
  }
  try {
    console.log('Adding message to database:', message);
    const createdAtString = message.createdAt instanceof Date 
      ? message.createdAt.toISOString() 
      : new Date(message.createdAt).toISOString();
    await db.execAsync(`
      INSERT INTO messages (id, text, createdAt, user, channelId) 
      VALUES ('${message._id}', '${message.text}', '${createdAtString}', '${JSON.stringify(message.user)}', '${message.channelId}')
    `);
    console.log('Message added successfully');
  } catch (error) {
    console.error('Error adding message:', error);
    Sentry.captureException(error);
  }
};

export const getMessages = async (channelId: string): Promise<IMessage[]> => {
  if (!db) {
    console.error('Database not initialized');
    return [];
  }
  try {
    console.log(`Fetching messages for channelId: ${channelId}`);
    const result = await db.getAllAsync<{
      id: string;
      text: string;
      createdAt: string;
      user: string;
      channelId: string;
    }>(`SELECT * FROM messages WHERE channelId = '${channelId}' ORDER BY createdAt DESC`);

    console.log('Raw result from database:', JSON.stringify(result));

    const messages: IMessage[] = result.map(row => ({
      _id: row.id,
      text: row.text,
      createdAt: new Date(parseInt(row.createdAt)).getTime(), // Convert to timestamp
      user: JSON.parse(row.user),
      channelId: row.channelId,
    }));

    console.log(`Fetched ${messages.length} messages:`, JSON.stringify(messages));
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    Sentry.captureException(error);
    return [];
  }
};
