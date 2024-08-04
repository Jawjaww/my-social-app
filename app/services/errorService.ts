import * as Sentry from "@sentry/react-native";
import { TFunction } from "i18next";

export type AuthError = {
  code: string;
  message: string;
};

export const handleAndLogError = (error: AuthError, t: TFunction): string => {
  const errorMessage = getErrorMessage(error);
  logError(error, error.code || 'unknown', errorMessage);
  return t(errorMessage);
};

const getErrorMessage = (error: AuthError): string => {
  const errorCode = error.code || 'unknown';
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'auth.error.emailAlreadyInUse',
    'auth/invalid-email': 'auth.error.invalidEmail',
    'auth/operation-not-allowed': 'auth.error.operationNotAllowed',
    'auth/weak-password': 'auth.error.weakPassword',
    'auth/user-disabled': 'auth.error.userDisabled',
    'auth/user-not-found': 'auth.error.userNotFound',
    'auth/wrong-password': 'auth.error.wrongPassword',
    'default': 'auth.error.generic',
  };
  return errorMessages[errorCode] || errorMessages['default'];
};

const logError = (error: AuthError, errorCode: string, errorMessage: string) => {
  console.error(`Error (${errorCode}): ${errorMessage}`, error);
  Sentry.captureException(error, {
    extra: {
      errorCode,
      errorMessage
    }
  });
};