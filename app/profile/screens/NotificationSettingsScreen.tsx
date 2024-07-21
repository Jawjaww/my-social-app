import React from 'react';
import { Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from '@emotion/native';
import Toast from '../../components/Toast';
import { useRecoilState } from 'recoil';
import { notificationSettingsState } from '../../notifications/notificationAtoms';
import { updateNotificationSettings } from '../../notifications/notificationServices';

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

const NotificationSettingsScreen: React.FC = () => {
  const [notificationSettings, setNotificationSettings] = useRecoilState(notificationSettingsState);
  const navigation = useNavigation();

  const handleToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = async () => {
    try {
      await updateNotificationSettings(notificationSettings);
      Toast({ message: "Paramètres de notification enregistrés", type: "success" });
      navigation.goBack();
    } catch (error) {
      Toast({ message: "Échec de l'enregistrement des paramètres", type: "error" });
    }
  };

  return (
    <Container>
      <Header>Préférences de Notification</Header>
      <SettingItem>
        <SettingLabel>Notifications Push</SettingLabel>
        <Switch
          value={notificationSettings.pushNotifications}
          onValueChange={() => handleToggle('pushNotifications')}
        />
      </SettingItem>
      <SettingItem>
        <SettingLabel>Notifications par Email</SettingLabel>
        <Switch
          value={notificationSettings.emailNotifications}
          onValueChange={() => handleToggle('emailNotifications')}
        />
      </SettingItem>
      <SaveButton onPress={handleSave}>
        <SaveButtonText>Enregistrer les paramètres</SaveButtonText>
      </SaveButton>
    </Container>
  );
};

export default NotificationSettingsScreen;