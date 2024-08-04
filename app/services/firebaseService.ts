import { getAuth, updateEmail as fbUpdateEmail } from 'firebase/auth';

const auth = getAuth();

export const updateEmail = async (newEmail: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const user = auth.currentUser;
    console.log('Current User:', user);
    if (user) {
      await fbUpdateEmail(user, newEmail);
      return { success: true };
    } else {
      throw new Error('User not authenticated');
    }
  } catch (error) {
    console.error('Error updating email:', error);
    return { success: false, error };
  }
};
