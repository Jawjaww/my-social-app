import { getAuth, updateEmail, sendEmailVerification, updatePassword, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const auth = getAuth();
const storage = getStorage();

export const updateUserProfile = async (displayName: string, photoURL: string | null) => {
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName,
      photoURL,
    });
  }
};

export const updateUserEmail = async (newEmail: string) => {
  const user = auth.currentUser;
  if (user) {
    await updateEmail(user, newEmail);
    await sendEmailVerification(user);
  } else {
    throw new Error('No user is signed in');
  }
};

export const updateUserPassword = async (newPassword: string) => {
  if (auth.currentUser) {
    await updatePassword(auth.currentUser, newPassword);
  }
};

export const uploadProfilePicture = async (file: File): Promise<string> => {
  const user = auth.currentUser;
  if (user) {
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);
    await updateProfile(user, { photoURL });
    return photoURL;
  }
  throw new Error('No user is signed in');
};
