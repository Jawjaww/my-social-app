import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './services/api';
import authReducer from './features/authentication/authSlice';
import notificationReducer from './notifications/notificationSlice';
import messagesReducer from './features/messages/messagesSlice';
import contactsReducer from './features/contacts/contactsSlice';
import toastReducer from './features/toast/toastSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,notifications: notificationReducer,
    messages: messagesReducer,
    contacts: contactsReducer,
    toast: toastReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;