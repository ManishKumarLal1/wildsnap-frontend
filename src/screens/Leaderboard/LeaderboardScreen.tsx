import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";

import { useState } from "react";

import { Colors } from "@/theme/colors";
import {
  useEffect,
} from "react";

import {
  ActivityIndicator,
} from "react-native";

import {
  getLeaderboard,
  LeaderboardUser,
} from "@/api/leaderboard";

import RankCard from "@/components/leaderboard/RankCard";



export default function LeaderboardScreen() {

const [users, setUsers] =
  useState<LeaderboardUser[]>([]);

const [myRank, setMyRank] =
  useState<number | null>(null);

const [loading, setLoading] =
  useState(true);

const [error, setError] =
  useState<string | null>(null);

useEffect(() => {
  loadLeaderboard();
}, []);

const loadLeaderboard = async () => {
  try {
    setLoading(true);
    setError(null);

    const data = await getLeaderboard();

    setUsers(data.leaderboard);
    setMyRank(data.rank);
  } catch (error) {
    console.error(
      "Leaderboard error:",
      error
    );

    setError(
      error instanceof Error
        ? error.message
        : "Failed to load leaderboard"
    );
  } finally {
    setLoading(false);
  }
};
if (loading) {
  return (
    <View style={styles.center}>
      <ActivityIndicator
        size="large"
        color={Colors.primary}
      />

      <Text style={styles.loadingText}>
        Loading leaderboard...
      </Text>
    </View>
  );
}
if (error) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorText}>
        {error}
      </Text>

      <Pressable
        style={styles.retryButton}
        onPress={loadLeaderboard}
      >
        <Text style={styles.retryText}>
          Try Again
        </Text>
      </Pressable>
    </View>
  );
}
  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>
              Leaderboard
            </Text>

            <Text style={styles.subtitle}>
              Explore. Discover. Compete.
            </Text>

            <View style={styles.podium}>
              {users.slice(0, 3).map(
                (user, index) => (
                  <View
                    key={user.id}
                    style={[
                      styles.podiumItem,
                      index === 0 &&
                        styles.firstPlace,
                    ]}
                  >
                    <Text style={styles.medal}>
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : "🥉"}
                    </Text>

                    <Text style={styles.podiumAvatar}>
                      {user.avatar}
                    </Text>

                    <Text
                      style={styles.podiumName}
                    >
                      {user.username}
                    </Text>

                    <Text style={styles.podiumXP}>
                      {user.xp.toLocaleString()} XP
                    </Text>
                  </View>
                )
              )}
            </View>

            <Text style={styles.sectionTitle}>
              Rankings
            </Text>
          </>
        }
        renderItem={({ item, index }) => (
          <RankCard
            user={item}
            rank={index + 1}
            isCurrentUser={
              item.username === "Manish"
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },

  title: {
    color: Colors.text,
    fontSize: 30,
    fontWeight: "800",
  },

  center: {
  flex: 1,
  backgroundColor: Colors.background,
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
},

loadingText: {
  color: Colors.textSecondary,
  marginTop: 10,
},

errorText: {
  color: Colors.textSecondary,
  textAlign: "center",
  marginBottom: 15,
},

retryButton: {
  backgroundColor: Colors.primary,
  paddingHorizontal: 20,
  paddingVertical: 12,
  borderRadius: 12,
},

retryText: {
  color: "#FFFFFF",
  fontWeight: "700",
},

  subtitle: {
    color: Colors.textSecondary,
    marginTop: 5,
  },

  tabs: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 4,
    marginTop: 22,
  },

  tab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 11,
  },

  activeTab: {
    backgroundColor: Colors.primary,
  },

  tabText: {
    color: Colors.textSecondary,
    fontWeight: "700",
  },

  activeTabText: {
    color: "#FFFFFF",
  },

  podium: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  podiumItem: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 15,
    marginHorizontal: 4,
  },

  firstPlace: {
    transform: [{ translateY: -10 }],
  },

  medal: {
    fontSize: 25,
  },

  podiumAvatar: {
    fontSize: 35,
    marginTop: 5,
  },

  podiumName: {
    color: Colors.text,
    fontWeight: "700",
    marginTop: 5,
  },

  podiumXP: {
    color: Colors.primary,
    fontSize: 11,
    marginTop: 3,
  },

  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 12,
  },
});