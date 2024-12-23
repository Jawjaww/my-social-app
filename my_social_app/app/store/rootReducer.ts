import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/authentication/authSlice';
import profileReducer from '../features/profile/profileSlice';
import notificationReducer from '../notifications/notificationSlice';
import messagesReducer from '../features/messages/messagesSlice';
import contactsReducer from '../features/contacts/contactsSlice';
import toastReducer from '../features/toast/toastSlice';
import { RESET_STORE } from './actions';
import { api } from '../services/api';

const appReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  notifications: notificationReducer,
  messages: messagesReducer,
  contacts: contactsReducer,
  toast: toastReducer,
  [api.reducerPath]: api.reducer,
});

// Export RootState type
export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STORE) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
