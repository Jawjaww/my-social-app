import { useState } from 'react';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

const useUpdatePassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updatePasswordInFirebase = async (currentPassword: string, newPassword: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      setError("Utilisateur non authentifié.");
      return false;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSuccess('Mot de passe mis à jour avec succès.');
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur inconnue s\'est produite.');
      return false;
    }
  };

  return { updatePasswordInFirebase, error, success };
};

export default useUpdatePassword;