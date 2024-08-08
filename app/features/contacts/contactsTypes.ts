import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ContactsStackParamList, RootStackParamList, MainTabParamList } from '../../navigation/AppNavigation';

export interface ContactListScreenProps {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<ContactsStackParamList, 'ContactList'>,
    CompositeNavigationProp<
      NativeStackNavigationProp<RootStackParamList>,
      NativeStackNavigationProp<MainTabParamList>
    >
  >;
}

export interface AddContactScreenProps {
  navigation: NativeStackNavigationProp<ContactsStackParamList, 'AddContact'>;
}