// HomeScreen.tsx

import React from 'react';
import { View, Text } from 'react-native';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/authAtoms';

const HomeScreen: React.FC = () => {
  const user = useRecoilValue(userState) as { email: string } | null;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {user ? (
        <Text>Welcome {user.email}</Text>
      ) : (
        <Text>Welcome</Text>
      )}
    </View>
  );
};

export default HomeScreen;
