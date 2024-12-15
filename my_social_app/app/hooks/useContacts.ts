import { useSelector } from 'react-redux';
import { selectContacts } from '../features/contacts/contactsSelectors';
import { Contact } from '../types/sharedTypes';

export const useContacts = () => {
  const contacts = useSelector(selectContacts);
  const contactsArray = Object.values(contacts);

  return {
    contacts: contactsArray,
    isLoading: false,
    isError: false,
  };
};