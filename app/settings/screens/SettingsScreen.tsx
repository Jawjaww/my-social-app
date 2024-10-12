import React from "react";
import { useTranslation } from 'react-i18next';
import styled from '@emotion/native';
import pickNotificationSound from '../../services/notificationSoundService';
import { 
  CenteredContainer, 
  Header, 
  Button, 
  ButtonText 
} from '../../components/StyledComponents';

const SettingsScreen = () => {
  const { t } = useTranslation();

  return (
    <CenteredContainer>
      <Header>{t('settings.title')}</Header>
      <Button onPress={pickNotificationSound}>
        <ButtonText>{t('settings.chooseNotificationSound')}</ButtonText>
      </Button>
    </CenteredContainer>
  );
};

export default SettingsScreen;