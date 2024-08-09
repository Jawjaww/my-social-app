import React from 'react';
import { View, Text } from 'react-native';
import { SharedActivity } from '../types/sharedTypes';

interface ActivityItemProps {
  activity: SharedActivity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  return (
    <View>
      <Text>{activity.description}</Text>
    </View>
  );
};

export default ActivityItem;