import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getNotificationSettings, updateNotificationSettings } from '../../../providers/NotificationManager';
import { handleAndLogError, AppError } from '../../../services/errorService';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setNotificationSettings } from '../../../features/profile/profileSlice';
import { addToast } from '../../../features/toast/toastSlice';
import { NotificationSettings } from '../../../types/sharedTypes';
import { Switch } from 'react-native';
import { 
  Container, 
  Card, 
  CardText, 
  Button, 
  ButtonText,
  CenteredContainer
} from '../../../components/StyledComponents';

const NotificationSettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const notificationSettings = useSelector((state: any) => state.profile.notificationSettings);

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const settings = await getNotificationSettings();
        dispatch(setNotificationSettings(settings));
      } catch (error) {
        const { message } = handleAndLogError(error as AppError, t);
        dispatch(addToast({ message, type: 'error' }));
      }
    };

    fetchNotificationSettings();
  }, [dispatch, t]);

  const handleToggle = (setting: keyof NotificationSettings) => {
    const updatedSettings = {
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    };
    dispatch(setNotificationSettings(updatedSettings));
  };

  const handleSave = async () => {
    try {
      await updateNotificationSettings(notificationSettings);
      dispatch(addToast({ 
        message: t("notification.success.saved"), 
        type: 'success' 
      }));
      navigation.goBack();
    } catch (error) {
      const { message } = handleAndLogError(error as AppError, t);
      dispatch(addToast({ message, type: 'error' }));
    }
  };

  return (
    <CenteredContainer>
      <Container>
        <Card>
          <CardText>{t("notification.pushNotifications")}</CardText>
          <Switch
            value={notificationSettings?.pushNotifications}
            onValueChange={() => handleToggle('pushNotifications')}
          />
        </Card>

        <Card>
          <CardText>{t("notification.emailNotifications")}</CardText>
          <Switch
            value={notificationSettings?.emailNotifications}
            onValueChange={() => handleToggle('emailNotifications')}
          />
        </Card>

        <Button onPress={handleSave}>
          <ButtonText>{t("notification.saveButton")}</ButtonText>
        </Button>

        <Button onPress={() => navigation.goBack()}>
          <ButtonText>{t("common.buttons.back")}</ButtonText>
        </Button>
      </Container>
    </CenteredContainer>
  );
};

export default NotificationSettingsScreen;