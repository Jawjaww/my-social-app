import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUser } from '../../authentication/authSelectors';
import ContactSuggestion from '../../../components/ContactSuggestion';
import { Contact } from '../../../types/sharedTypes';

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);

  // Ces données devraient idéalement venir d'une API ou d'un hook personnalisé
  const contactSuggestions: Contact[] = [
    { contactUid: '1', contactUsername: 'user1', contactAvatarUrl: null },
    { contactUid: '2', contactUsername: 'user2', contactAvatarUrl: null },
    { contactUid: '3', contactUsername: 'user3', contactAvatarUrl: null },
  ];

  const recentActivities = [
    { id: '1', description: 'Activity 1' },
    { id: '2', description: 'Activity 2' },
    { id: '3', description: 'Activity 3' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeText}>
        {t('home.welcomeUser', { name: user?.email || 'Guest' })}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.contactSuggestions')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {contactSuggestions.map((contact) => (
            <ContactSuggestion key={contact.contactUid} contact={contact} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.recentActivity')}</Text>
        {recentActivities.map((activity) => (
          <Text key={activity.id} style={styles.activityItem}>
            {activity.description}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  activityItem: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default HomeScreen;