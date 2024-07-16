import React from 'react';
import { View, Text } from 'react-native';
import { useRecoilValue } from 'recoil';
import { userState } from '../authentication/recoil/authAtoms';

function ProtectedScreen() {
  const user = useRecoilValue(userState);

  if (!user) {
    return (
      <View>
        <Text>Accès refusé. Veuillez vous connecter.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Écran protégé</Text>
    </View>
  );
}

export default ProtectedScreen;