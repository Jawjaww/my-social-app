import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  SectionList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  useGetContactsQuery,
  useGetRecentChatsQuery,
} from "../../../services/api";
import UserListItem from "../components/UserListItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MessagesStackParamList } from "../../../types/sharedTypes";
import { Contact } from "../../../types/sharedTypes";
import { ActivityIndicator } from "react-native";

const NewChatScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation =
    useNavigation<NativeStackNavigationProp<MessagesStackParamList>>();
  const { data: contacts, isLoading: contactsLoading } = useGetContactsQuery();
  const { data: recentChats, isLoading: recentChatsLoading } =
    useGetRecentChatsQuery();
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (contacts) {
      setFilteredContacts(
        contacts.filter((contact) =>
          contact.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [contacts, searchQuery]);

  const handleUserPress = (userId: string) => {
    navigation.navigate("Chat", { contactId: userId });
  };

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => <Text style={styles.sectionHeader}>{title}</Text>;

  const renderItem = ({ item }: { item: Contact }) => (
    <UserListItem
      user={{
        id: item.id,
        username: item.username,
        avatar: item.avatar || "https://via.placeholder.com/150",
      }}
      onPress={() => handleUserPress(item.id)}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
    </View>
  );

  if (contactsLoading || recentChatsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const sections = [
    { title: "Conversations récentes", data: recentChats || [] },
    { title: "Tous les contacts", data: filteredContacts },
  ].filter((section) => section.data.length > 0);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={24}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un ami par pseudo"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyComponent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Aucun contact ni conversation récente
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.newGroupButton}
        onPress={() => navigation.navigate("CreateGroup" as never)}
      >
        <Ionicons name="people" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    margin: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  newGroupButton: {
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default NewChatScreen;
