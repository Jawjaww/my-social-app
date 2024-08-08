import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contact } from '../../types/sharedTypes';

interface ContactsState {
  list: Contact[];
}

const initialState: ContactsState = {
  list: [],
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.list = action.payload;
    },
    addContact: (state, action: PayloadAction<Contact>) => {
      state.list.push(action.payload);
    },
    removeContact: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(contact => contact.id !== action.payload);
    },
  },
});

export const { setContacts, addContact, removeContact } = contactsSlice.actions;
export default contactsSlice.reducer;