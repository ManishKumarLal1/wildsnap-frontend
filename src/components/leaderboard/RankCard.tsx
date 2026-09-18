import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Colors } from "@/theme/colors";
import { LeaderboardUser } from "@/api/leaderboard";

interface Props {
  user: LeaderboardUser;
  rank: number;
  isCurrentUser?: boolean;
}

export default function RankCard({
  user,
  rank,
  isCurrentUser = false,
}: Props) {
  return (
    <View
      style={[
        styles.card,
        isCurrentUser && styles.currentUser,
      ]}
    >
      <View style={styles.rankContainer}>
        <Text style={styles.rank}>
          {rank}
        </Text>
      </View>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.avatar}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.username}>
          {user.username}
        </Text>

        <Text style={styles.level}>
          Level {user.level} • 🔥 {user.streak} day streak
        </Text>
      </View>

      <View style={styles.xpContainer}>
        <Text style={styles.xp}>
          {user.xp.toLocaleString()}
        </Text>

        <Text style={styles.xpLabel}>
          XP
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,

    flexDirection: "row",
    alignItems: "center",
  },

  currentUser: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  rankContainer: {
    width: 35,
    alignItems: "center",
  },

  rank: {
    color: Colors.textSecondary,
    fontSize: 17,
    fontWeight: "800",
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,

    backgroundColor: Colors.surfaceLight,

    alignItems: "center",
    justifyContent: "center",

    marginHorizontal: 10,
  },

  avatarText: {
    fontSize: 25,
  },

  info: {
    flex: 1,
  },

  username: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
  },

  level: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },

  xpContainer: {
    alignItems: "flex-end",
  },

  xp: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },

  xpLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
});