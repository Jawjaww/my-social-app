import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { MessagesStackParamList } from '../../navigation/AppNavigation';

export interface MessageListScreenProps {
  navigation: NativeStackNavigationProp<MessagesStackParamList, 'MessageList'>;
}

export interface ChatScreenProps {
  navigation: NativeStackNavigationProp<MessagesStackParamList, 'Chat'>;
  route: RouteProp<MessagesStackParamList, 'Chat'>;
}