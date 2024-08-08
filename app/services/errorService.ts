import * as Sentry from "@sentry/react-native";
import { TFunction } from "i18next";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

export type AppError = FetchBaseQueryError | SerializedError | Error;

export const handleAndLogError = (error: AppError, t: TFunction): string => {
  const errorCode = getErrorCode(error);
  const errorMessage = getErrorMessage(errorCode);
  logError(error, errorCode, errorMessage);
  return t(errorMessage);
};

const getErrorCode = (error: AppError): string => {
  if (typeof error === 'object' && error !== null) {
    if ('status' in error) {
      return error.status === 'CUSTOM_ERROR' && typeof error.data === 'object' && error.data !== null && 'code' in error.data
        ? error.data.code as string || 'unknown'
        : `${error.status}`;
    } else if ('code' in error && typeof error.code === 'string') {
      return error.code;
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