import { createSelector } from '@reduxjs/toolkit';
import { RootState } from "../../store/store";
import { Contact } from "../../types/sharedTypes";

export const selectContacts = (state: RootState) => state.contacts;

export const selectContactList = createSelector(
  [selectContacts],
  (contacts): Contact[] => Object.values(contacts)
);

export const selectContactById = (contactUid: string) => createSelector(
  [selectContacts],
  (contacts) => contacts[contactUid] || null
);