import React, { useState } from 'react';
import { Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from '@emotion/native';
import Toast from '../../../components/Toast';
import { updateNotificationSettings } from '../../../notifications/notificationServices';
import { handleAndLogError, AppError } from '../../../services/errorService';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { selectNotificationSettings, setNotificationSettings, NotificationSettings } from '../../../notifications/notificationSlice';

const Container = styled.View`
  flex: 1;
  padding: 20px;
`;

const Header = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const SettingItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SettingLabel = styled.Text`
  font-size: 16px;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #007AFF;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
`;

const SaveButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
`;

const NotificationSettingsScreen: React.FC = () => {
  const notificationSettings = useSelector(selectNotificationSettings);
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const { t } = useTranslation();

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
      const errorMessage = handleAndLogError(error as AppError, t);
      setError(errorMessage);
      Toast({ message: t("notification.error.saveFailed"), type: "error" });
    }
  };

  return (
    <Container>
      <Header>{t('notification.title')}</Header>
      {error && <ErrorText>{error}</ErrorText>}

      <SettingItem>
        <SettingLabel>{t('notification.pushNotifications')}</SettingLabel>
        <Switch
          value={notificationSettings.pushNotifications}
          onValueChange={() => handleToggle('pushNotifications')}
        />
      </SettingItem>
      <SettingItem>
        <SettingLabel>{t('notification.emailNotifications')}</SettingLabel>
        <Switch
          value={notificationSettings.emailNotifications}
          onValueChange={() => handleToggle('emailNotifications')}
        />
      </SettingItem>
      <SaveButton onPress={handleSave}>
        <SaveButtonText>{t('notification.saveButton')}</SaveButtonText>
      </SaveButton>
    </Container>
  );
};

export default NotificationSettingsScreen;