import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PARSE_SERVER_URL, PARSE_APP_ID, PARSE_MASTER_KEY } from '@env';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(PARSE_APP_ID, undefined, PARSE_MASTER_KEY);
Parse.serverURL = PARSE_SERVER_URL;