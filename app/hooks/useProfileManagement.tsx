import { useState } from 'react';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { handleError } from '../../services/errorService';
import { useTranslation } from 'react-i18next';

const useProfileManagement = () => {
    const [email, setEmail] = useState<string>(''); 
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { t } = useTranslation();

    const updateEmailInProfile = async (newEmail: string, password: string) => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            setError(t('profile.errors.notAuthenticated'));
            return false;
        }

        try {
            const credential = EmailAuthProvider.credential(currentUser.email || '', password);
            await reauthenticateWithCredential(currentUser, credential);
            await updateEmail(currentUser, newEmail);
            setSuccess(t('profile.success.emailUpdated'));
            return true;
        } catch (error) {
            setError(t(handleError(error)));
            return false;
        }
    };

    const updatePasswordInProfile = async (currentPassword: string, newPassword: string) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError(t('profile.errors.notAuthenticated'));
            return false;
        }
        try {
            if (!user.email) {
                setError(t('profile.errors.emailRequired'));
                return false;
            }
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            setSuccess(t('profile.success.passwordUpdated'));
            return true;
        } catch (error) {
            setError(t(handleError(error)));
            return false;
        }
    };

    const updateUserProfile = async (displayName: string, photoURL: string | null) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError(t('profile.errors.notAuthenticated'));
            return false;
        }

        try {
            await updateProfile(user, { displayName, photoURL: photoURL || '' });
            setSuccess(t('profile.success.profileUpdated'));
            return true;
        } catch (error) {
            setError(t(handleError(error)));
            return false;
        }
    };

    return { email, setEmail, updateEmailInProfile, updatePasswordInProfile, updateUserProfile, error, success };
};

export default useProfileManagement;