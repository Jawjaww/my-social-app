import React from "react";
import { View, Text } from "react-native";
import styled from '@emotion/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const SettingsScreen = () => {
  return (
    <Container>
      <Text>Paramètres</Text>
    </Container>
  );
};

export default SettingsScreen;