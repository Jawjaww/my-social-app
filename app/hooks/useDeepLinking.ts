import { useMemo } from 'react';
import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';

const useDeepLinking = (): LinkingOptions<RootStackParamList> => {
  return useMemo(() => ({
    prefixes: ['https://mysocialapp.com', 'mysocialapp://'],
    config: {
      screens: {
        Auth: {
          screens: {
            ResetPassword: {
              path: 'resetPassword',
              parse: {
                oobCode: (oobCode: string) => oobCode,
              },
            },
            VerifyEmail: {
              path: 'verifyEmail',
              parse: {
                oobCode: (oobCode: string) => oobCode,
              },
            },
          },
        },
        Main: {
          screens: {
            Home: 'home',
            Profile: 'profile',
            Message: 'message',
          },
        },
      },
    },
  }), []);
};

export default useDeepLinking;