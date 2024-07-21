import { useState } from 'react';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updateEmail, sendEmailVerification } from 'firebase/auth';
import { useRecoilState } from 'recoil';
import { userState } from '../authentication/recoil/authAtoms';

const useUpdateEmail = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useRecoilState(userState);

  const updateEmailInFirebase = async (newEmail: string, password: string) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setError("Utilisateur non authentifié.");
      return false;
    }

    try {
      const credential = EmailAuthProvider.credential(currentUser.email || '', password);
      await reauthenticateWithCredential(currentUser, credential);
      await updateEmail(currentUser, newEmail);
      await sendEmailVerification(currentUser);
      setSuccess('Un email de vérification a été envoyé à votre nouvelle adresse.');
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur inconnue s\'est produite.');
      return false;
    }
  };

  return { updateEmailInFirebase, error, success };
};

export default useUpdateEmail;