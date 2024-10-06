import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useGetContactProfileQuery } from '../services/api';

interface ContactInfoHeaderProps {
  contactUid: string;
  onInfoPress: () => void;
}

const ContactInfoHeader: React.FC<ContactInfoHeaderProps> = ({ contactUid, onInfoPress }) => {
  const { data: profile } = useGetContactProfileQuery(contactUid);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{profile?.contactUsername || 'Unknown'}</Text>
      <TouchableOpacity onPress={onInfoPress}>
        <Text style={styles.infoButton}>Info</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoButton: {
    color: 'blue',
  },
});

export default ContactInfoHeader;