import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  SectionList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  useGetContactsQuery,
  useGetRecentChatsQuery,
  useGetUserProfileQuery,
} from "../../../services/api";
import UserListItem from "../components/UserListItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Contacts, MessagesStackParamList, ProfileUser } from "../../../types/sharedTypes";
import { useSelector } from "react-redux";
import { selectUser } from "../../authentication/authSelectors";

const NewChatScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<MessagesStackParamList>>();
  const user = useSelector(selectUser);
  const { data: contacts, isLoading: contactsLoading } = useGetContactsQuery(user?.uid || '');
  const { data: recentChats, isLoading: recentChatsLoading } = useGetRecentChatsQuery();
  const [filteredProfileUsers, setFilteredProfileUsers] = useState<ProfileUser[]>([]);

  useEffect(() => {
    if (contacts) {
      const fetchProfiles = async () => {
        const profiles = await Promise.all(
          Object.keys(contacts).map(async (contactUid) => {
            const result = await useGetUserProfileQuery(contactUid);
            return result.data;
          })
        );
        setFilteredProfileUsers(
          profiles.filter((profile): profile is ProfileUser => 
            !!profile && !!profile.username && profile.username.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      };
      fetchProfiles();
    }
  }, [contacts, searchQuery]);

  const handleUserPress = (userId: string) => {
    navigation.navigate("Chat", { contactUid: userId });
  };

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => <Text style={styles.sectionHeader}>{title}</Text>;

  const renderItem = ({ item }: { item: ProfileUser }) => (
    <UserListItem
      user={{
        id: item.uid,
        username: item.username || "",
        avatar: item.avatarUrl || "https://via.placeholder.com/150",
      }}
      onPress={() => handleUserPress(item.uid)}
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
    { title: "Tous les utilisateurs", data: filteredProfileUsers },
  ];

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
          sections={sections as Array<{ title: string; data: ProfileUser[] }>}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.uid}
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
    backgroundColor: "#fff",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NewChatScreen;