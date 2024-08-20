import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/authentication/authSlice';
import notificationReducer from '../notifications/notificationSlice';
import messagesReducer from '../features/messages/messagesSlice';
import contactsReducer from '../features/contacts/contactsSlice';
import toastReducer from '../features/toast/toastSlice';
import profileReducer from '../features/profile/profileSlice';
import { RESET_STORE } from './actions';
import { api } from '../services/api';

const appReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer,
  messages: messagesReducer,
  contacts: contactsReducer,
  toast: toastReducer,
  profile: profileReducer,
  [api.reducerPath]: api.reducer,
  // Add other slices of your store here
});

const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STORE) {
    return appReducer(undefined, action);  // Reinitialize all state
  }
  return appReducer(state, action);
};

export default rootReducer;
