import React from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { RootState } from "../../../store/store";
import MessageListItem from "../components/MessageListItem";
import { MessageListScreenProps, MessagesStackParamList } from "../../../types/sharedTypes";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CenteredContainer, Container } from "../../../components/StyledComponents";

const MessageListScreen: React.FC<MessageListScreenProps> = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MessagesStackParamList>>();
  const conversations = useSelector(
    (state: RootState) => state.messages.conversations
  );

  const renderItem = ({ item: userId }: { item: string }) => (
    <MessageListItem
      userId={userId}
      onPress={() => navigation.navigate("Chat", { contactId: userId })}
    />
  );

  const renderEmptyComponent = () => (
    <CenteredContainer>
      <Container>
      <Text style={styles.emptyText}>Aucun message reçu</Text>
      </Container>
    </CenteredContainer>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(conversations)}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        ListEmptyComponent={renderEmptyComponent}
      />
      <TouchableOpacity
        style={styles.newChatButton}
        onPress={() => navigation.navigate("NewChat")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  newChatButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default MessageListScreen;