import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from '@emotion/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';

const UserItemContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 10px;
  margin-bottom: 10px;
`;

const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 15px;
`;

const Username = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const AddButton = styled(TouchableOpacity)`
  margin-left: auto;
`;

interface UserListItemProps {
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  onPress: () => void;
  showAddButton?: boolean;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onPress, showAddButton }) => {
  const theme = useTheme();

  return (
    <UserItemContainer onPress={onPress}>
      <Avatar source={{ uri: user.avatar }} />
      <Username>{user.username}</Username>
      {showAddButton && (
        <AddButton>
          <Ionicons name="person-add" size={24} color={theme.colors.primary} />
        </AddButton>
      )}
    </UserItemContainer>
  );
};

export default UserListItem;