import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendEmailVerification, User } from 'firebase/auth';

const useAuthService = () => {
  const auth = getAuth();

  const signIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = async () => {
    return await signOut(auth);
  };

  const createUser = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  const sendVerificationEmail = async (user: User) => { 
    return await sendEmailVerification(user);
  };

  return { signIn, signOutUser, createUser, sendVerificationEmail, auth }; // Expose auth if needed
};

export default useAuthService;