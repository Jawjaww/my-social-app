import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import styled from '@emotion/native';
import { loadCustomFont } from '../../../utils/fontloader'; 

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #000; 
`;

const AppTitle = styled(Animated.Text)`
  font-size: 36px;
  font-weight: bold;
  color: #00f;
  font-family: 'Orbitron'; 
`;

const BootScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      const loaded = await loadCustomFont();
      setFontLoaded(loaded);
    };

    loadFont();

    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 1000,
          easing: Easing.sin,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Container>
      <AppTitle style={{
        opacity: fadeAnim,
        textShadowColor: 'rgba(0, 0, 255, 0.75)',
        textShadowOffset: {width: 0, height: 0},
        textShadowRadius: 10
      }}>
        {fontLoaded ? "My Social App" : "Loading..."}
      </AppTitle>
    </Container>
  );
};

export default BootScreen;