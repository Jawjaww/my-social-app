import { AppUser } from '../authentication/authTypes';

export interface ProfileScreenProps {
  user: AppUser | null;
}

export interface EditProfileScreenProps {
  user: AppUser | null;
}
