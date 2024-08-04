import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigationTypes';

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
}

export interface FriendListScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

export interface AddFriendScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}