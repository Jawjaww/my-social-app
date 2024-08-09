import React from 'react';
import { View, Text } from 'react-native';
import styled from '@emotion/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #000;
`;

const AppTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #0785af;
  text-shadow-color: rgba(0, 0, 255, 0.75);
  text-shadow-offset: 0px 0px;
  text-shadow-radius: 10px;
`;

const BootScreen: React.FC = () => {
  return (
    <Container>
      <AppTitle>My Social App</AppTitle>
    </Container>
  );
};

export default BootScreen;