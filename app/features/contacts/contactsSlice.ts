import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Contact } from "../../types/sharedTypes";
import { api } from "../../services/api";

interface ContactsState {
  [contactUid: string]: Contact;
}

const initialState: ContactsState = {};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    resetContacts: () => initialState,
  },
  extraReducers: (builder) => {
    builder
    .addMatcher(
      api.endpoints.getContacts.matchFulfilled,
      (state, action: PayloadAction<{ [key: string]: Contact } | undefined>) => {
        if (action.payload) {
          return { ...state, ...action.payload };
        }
        return state;
        }
      )
      .addMatcher(
        api.endpoints.addContact.matchFulfilled,
        (state, action: PayloadAction<Contact>) => {
          state[action.payload.contactUid] = action.payload;
        })
      .addMatcher(
        api.endpoints.deleteContact.matchFulfilled,
        (state, action: PayloadAction<string>) => {
          delete state[action.payload];
        }
      );
  },
});

export const { resetContacts } = contactsSlice.actions;
export default contactsSlice.reducer;