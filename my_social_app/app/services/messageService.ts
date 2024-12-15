import { IMessage, MessageRow } from '../types/sharedTypes';
import * as SQLite from 'expo-sqlite';
import Parse from 'parse/react-native';

interface SQLiteTransaction {
  executeSql: (
    sqlStatement: string,
    args?: (string | number)[],
    callback?: (tx: SQLiteTransaction, result: SQLite.SQLResultSet) => void,
    errorCallback?: (tx: SQLiteTransaction, error: Error) => boolean
  ) => void;
}

interface Database {
  transaction: (
    callback: (tx: SQLiteTransaction) => void,
    error?: (error: Error) => void,
    success?: () => void
  ) => void;
}

let db: Database;

export const initMessageService = () => {
  db = SQLite.openDatabase('messages.db');
  
  db.transaction((tx: SQLiteTransaction) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        channel_id TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        user_id TEXT NOT NULL
      )`,
      [],
      () => console.log('✅ Table messages created successfully'),
      (_, error: Error) => {
        console.error('❌ Error creating table:', error);
        return false;
      }
    );
  });
};

export const getMessages = async (channelId: string): Promise<IMessage[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: SQLiteTransaction) => {
      tx.executeSql(
        `SELECT * FROM messages WHERE channel_id = ? ORDER BY created_at DESC`,
        [channelId],
        (_, result: SQLite.SQLResultSet) => {
          const messages: IMessage[] = [];
          for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i) as MessageRow;
            messages.push({
              _id: row.id,
              text: row.text,
              createdAt: row.created_at,
              channelId: row.channel_id,
              user: {
                _id: row.user_id
              }
            });
          }
          resolve(messages);
        },
        (_, error: Error) => {
          console.error('Error retrieving messages:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const addMessage = async (message: IMessage): Promise<void> => {
  // 1. Save locally
  await new Promise((resolve, reject) => {
    db.transaction((tx: SQLiteTransaction) => {
      tx.executeSql(
        `INSERT INTO messages (id, channel_id, text, created_at, user_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          message._id,
          message.channelId,
          message.text,
          typeof message.createdAt === 'number' ? message.createdAt : message.createdAt.getTime(),
          message.user._id
        ],
        () => resolve(undefined),
        (_, error: Error) => {
          console.error('Error adding message:', error);
          reject(error);
          return false;
        }
      );
    });
  });

  // 2. Send notification via Parse Cloud
  try {
    const pushData = {
      alert: message.text,
      badge: "Increment",
      sound: "default",
      priority: "high",
      data: {
        type: 'new_message',
        messageId: message._id,
        channelId: message.channelId,
        webrtc: message.webrtc || null,
        senderId: message.user._id,
        messageType: message.webrtc ? 'webrtc' : 'text'
      }
    };

    await Parse.Cloud.run('sendPush', {
      userId: message.channelId,
      data: pushData
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    // Do not block message sending if notification fails
  }
};

export const deleteMessages = async (channelId: string, messageIds: string[]): Promise<void> => {
  const placeholders = messageIds.map(() => '?').join(',');
  const query = `DELETE FROM messages WHERE channel_id = ? AND id IN (${placeholders})`;
  const params = [channelId, ...messageIds];

  return new Promise((resolve, reject) => {
    db.transaction((tx: SQLiteTransaction) => {
      tx.executeSql(
        query,
        params,
        () => resolve(),
        (_, error: Error) => {
          console.error('Error deleting messages:', error);
          reject(error);
          return false;
        }
      );
    });
  });
};