import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

interface MessageListItemProps {
  userId: string;
  onPress: () => void;
}

const MessageListItem: React.FC<MessageListItemProps> = ({
  userId,
  onPress,
}) => {
  const conversation = useSelector(
    (state: RootState) => state.messages.conversations[userId]
  );
  const isOnline = useSelector((state: RootState) =>
    state.messages.onlineUsers.includes(userId)
  );
  const isTyping = useSelector(
    (state: RootState) => state.messages.typingUsers[userId]
  );

  const lastMessage = conversation[0];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        style={styles.avatar}
        source={{
          uri:
            typeof lastMessage?.user?.avatar === "string"
              ? lastMessage.user.avatar
              : "https://placeimg.com/140/140/any",
        }}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{lastMessage.user.name}</Text>
        <Text style={styles.message}>
          {isTyping ? "Typing..." : lastMessage.text}
        </Text>
      </View>
      <Text style={styles.time}>
        {new Date(lastMessage.createdAt).toLocaleTimeString()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "green",
    position: "absolute",
    bottom: 10,
    left: 40,
    borderWidth: 2,
    borderColor: "white",
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    color: "gray",
  },
  time: {
    fontSize: 12,
    color: "gray",
  },
});

export default MessageListItem;
