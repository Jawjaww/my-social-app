declare module 'expo-sqlite' {
  export interface SQLTransaction {
    executeSql: (
      sqlStatement: string,
      args?: any[],
      callback?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void,
      errorCallback?: (transaction: SQLTransaction, error: SQLError) => boolean
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

  export interface SQLiteDatabase {
    transaction(
      callback: (transaction: SQLTransaction) => void,
      errorCallback?: (error: SQLError) => void,
      successCallback?: () => void
    ): void;
  }

  export function openDatabaseSync(name: string): SQLiteDatabase;
}
