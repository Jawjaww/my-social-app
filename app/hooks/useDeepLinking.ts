import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';
import { NavigationProp } from '@react-navigation/native';

const useDeepLinking = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      console.log('Deep link handled:', url);
    
      const parsedUrl = new URL(url);
      const routeName = parsedUrl.pathname.split('/')[1];
      const oobCode = parsedUrl.searchParams.get('oobCode');
      const mode = parsedUrl.searchParams.get('mode');
    
      console.log('Parsed URL:', { routeName, oobCode, mode });
    
      if (oobCode) {
        switch (mode) {
          case 'resetPassword':
            navigation.navigate('ResetPassword', { oobCode });
            break;
          case 'verifyEmail':
            navigation.navigate('VerifyEmail', { oobCode });
            break;
          default:
            console.log('Unknown mode:', mode);
        }
      } else {
        console.log('No oobCode found in the URL');
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Verify if there is an initial link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [navigation]);
};

export default useDeepLinking;