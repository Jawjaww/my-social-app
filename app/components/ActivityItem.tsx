import React from 'react';
import { View, Text } from 'react-native';
import { Activity } from '../types/sharedTypes';

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <View>
      <Text>{activity.description}</Text>
    </View>
  );
};

export default ActivityItem;