declare module 'expo-sqlite' {
  export interface SQLTransaction {
    executeSql: (
      sqlStatement: string,
      args?: any[],
      callback?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void,
      errorCallback?: (transaction: SQLTransaction, error: Error) => boolean
    ) => void;
  }

  export interface SQLResultSet {
    insertId: number;
    rowsAffected: number;
    rows: {
      length: number;
      item: (index: number) => any;
      _array: any[];
    };
  }

  export interface SQLError extends Error {
    code: number;
  }

  export interface Database {
    transaction(
      callback: (transaction: SQLTransaction) => void,
      errorCallback?: (error: SQLError) => void,
      successCallback?: () => void
    ): void;
  }

  export function openDatabase(name: string): Database;

  export interface SQLiteProviderProps {
    children: React.ReactNode;
    databaseName: string;
  }

  export const SQLiteProvider: React.FC<SQLiteProviderProps>;
  export function useSQLiteContext(): Database;
}
