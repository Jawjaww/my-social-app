import { useDispatch } from 'react-redux';
import { setUser } from '../features/authentication/authSlice';
import { resetContacts } from '../features/contacts/contactsSlice';
import { useSignOutMutation } from '../services/api';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/authentication/authSelectors';

export const useAuth = () => {
  const dispatch = useDispatch();
  const [signOutMutation] = useSignOutMutation();
  const user = useSelector(selectUser);
  const handleSignOut = async () => {
    try {
      // Call the API for sign out
      await signOutMutation(user?.uid ?? '').unwrap();
      
      // Reset contacts
      dispatch(resetContacts());
      
      // Update authentication state
      dispatch(setUser(null));
      
      // You can add other necessary actions for sign out here
    } catch (error) {
      console.error('Error during sign out:', error);
      console.error('Error type:', typeof error);
      // Handle the error (e.g., display a message to the user)
    }
  };

  return { handleSignOut };
};