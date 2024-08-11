import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ListRenderItem,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectUser } from "../../authentication/authSelectors";
import {
  useGetContactActivitiesQuery,
  useGetUnreadMessagesCountQuery,
  useGetContactSuggestionsQuery,
} from "../../../services/api";
import ActivityItem from "../../../components/ActivityItem";
import ContactSuggestion from "../../../components/ContactSuggestion";
import { Activity, Contact } from "../../../types/sharedTypes";
import { ActivityIndicator } from "react-native";

type RenderItemData = Activity | null;

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);
  const { data: activities = [] } = useGetContactActivitiesQuery();
  const { data: unreadCount } = useGetUnreadMessagesCountQuery();
  const { data: contactSuggestions = [] } = useGetContactSuggestionsQuery();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const headerHeight = 100;

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  {
    user?.username ? `Bienvenue, ${user.username}!` : "Bienvenue !";
  }
  const renderItem: ListRenderItem<RenderItemData> = ({ item, index }) => {
    if (index === 0) {
      return (
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            {t("home.welcomeUser", {
              name: user?.username || t("home.anonymousUser"),
            })}
          </Text>
          {activities.length > 0 && (
            <TouchableOpacity style={styles.newActivitiesContainer}>
              <Text style={styles.newActivitiesText}>
                {t("home.newActivities", { count: activities.length })}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    } else if (activities.length > 0 && index === 1) {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t("home.recentActivity")}</Text>
        </View>
      );
    } else if (activities.length === 0 && index === 1) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t("home.noRecentActivity")}</Text>
        </View>
      );
    } else if (item) {
      return <ActivityItem activity={item} />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const data: RenderItemData[] = [null, ...activities, null];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedHeader, { height: headerHeight }]}>
        <Text style={styles.headerTitle}>{t("home.title")}</Text>
      </Animated.View>
      <Animated.FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => (item ? item.id : index.toString())}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
      {contactSuggestions.length > 0 && (
        <View style={styles.contactSuggestionsContainer}>
          {contactSuggestions.map((contact: Contact) => (
            <ContactSuggestion key={contact.id} contact={contact} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  animatedHeader: {
    backgroundColor: "#007AFF",
    justifyContent: "flex-end",
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 20,
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
  },
  newActivitiesContainer: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  newActivitiesText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contactSuggestionsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
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

export default HomeScreen;
