import * as Sentry from "@sentry/react-native";
import { TFunction } from "i18next";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

export type AppError = FetchBaseQueryError | SerializedError | Error;

export const handleAndLogError = (error: FetchBaseQueryError | SerializedError, t: TFunction): { message: string; code: string } => {
  const errorCode = getErrorCode(error);
  const errorMessage = getErrorMessage(errorCode);
  logError(error, errorCode, errorMessage);
  return { message: t(errorMessage), code: errorCode };
};

const getErrorCode = (error: AppError): string => {
  if (typeof error === 'object' && error !== null) {
    if ('status' in error && error.status === 'CUSTOM_ERROR') {
      if (typeof error.data === 'object' && error.data !== null && 'code' in error.data) {
        return error.data.code as string;
      }
      if (typeof error.error === 'string' && error.error.includes('auth/')) {
        return error.error.split('(')[1].split(')')[0];
      }
    } else if ('code' in error && typeof error.code === 'string') {
      return error.code;
    } else if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
  }
  return 'unknown';
};

const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'auth.error.invalidEmail',
    'auth/user-disabled': 'auth.error.userDisabled',
    'auth/user-not-found': 'auth.error.userNotFound',
    'auth/wrong-password': 'auth.error.wrongPassword',
    'auth/too-many-requests': 'auth.error.tooManyRequests',
    'auth/network-request-failed': 'auth.error.networkRequestFailed',
    'auth/invalid-credential': 'auth.error.invalidCredential',
    'auth/email-already-in-use': 'auth.error.emailAlreadyInUse',
    'auth/weak-password': 'auth.error.weakPassword',
    'auth/operation-not-allowed': 'auth.error.operationNotAllowed',
    'auth/account-exists-with-different-credential': 'auth.error.accountExistsWithDifferentCredential',
    'auth/invalid-verification-code': 'auth.error.invalidVerificationCode',
    'auth/invalid-verification-id': 'auth.error.invalidVerificationId',
    'auth/expired-action-code': 'auth.error.expiredActionCode',
    'auth/invalid-action-code': 'auth.error.invalidActionCode',
    '400': 'error.badRequest',
    '401': 'error.unauthorized',
    '403': 'error.forbidden',
    '404': 'error.notFound',
    '500': 'error.serverError',
    'default': 'error.generic',
  };
  return errorMessages[errorCode] || errorMessages['default'];
};

const logError = (error: AppError, errorCode: string, errorMessage: string) => {
  console.error(`Error occurred: ${errorCode} - ${errorMessage}`, error);
  Sentry.captureException(error, {
    extra: {
      errorCode,
      errorMessage,
    },
  });
};