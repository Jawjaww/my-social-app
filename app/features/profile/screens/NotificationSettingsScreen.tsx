import React, { useState } from 'react';
import { Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from '../../../components/Toast';
import { updateNotificationSettings } from '../../../notifications/notificationServices';
import { handleAndLogError, AppError } from '../../../services/errorService';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { selectNotificationSettings, setNotificationSettings, NotificationSettings } from '../../../notifications/notificationSlice';
import {
  CenteredContainer,
  Container,
  Button,
  ButtonText,
  ErrorText,
  Card,
  CardText
} from '../../../components/StyledComponents';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';

const NotificationSettingsScreen: React.FC = () => {
  const notificationSettings = useSelector(selectNotificationSettings);
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();

  const handleToggle = (setting: keyof NotificationSettings) => {
    dispatch(setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    }));
  };

  const handleSave = async () => {
    try {
      await updateNotificationSettings(notificationSettings);
      Toast({ message: t("notification.success.saved"), type: "success" });
      navigation.goBack();
    } catch (error) {
      const { message } = handleAndLogError(error as AppError, t);
      setError(message);
      Toast({ message: t("notification.error.saveFailed"), type: "error" });
    }
  };

  return (
    <CenteredContainer>
      <Container>
        {error && <ErrorText>{error}</ErrorText>}

        <Card>
          <CardText>{t('notification.pushNotifications')}</CardText>
          <Switch
            value={notificationSettings.pushNotifications}
            onValueChange={() => handleToggle('pushNotifications')}
          />
        </Card>

        <Card>
          <CardText>{t('notification.emailNotifications')}</CardText>
          <Switch
            value={notificationSettings.emailNotifications}
            onValueChange={() => handleToggle('emailNotifications')}
          />
        </Card>

        <Button onPress={handleSave}>
          <ButtonText>{t('notification.saveButton')}</ButtonText>
        </Button>

        <Card onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          <CardText>{t('common.buttons.back')}</CardText>
        </Card>
      </Container>
    </CenteredContainer>
  );
};

export default NotificationSettingsScreen;