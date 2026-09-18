import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";

import { router } from "expo-router";

import { Colors } from "@/theme/colors";
import { useUserStore } from "@/store/userStore";

import { getAchievements } from "@/utils/achievements";
import { Achievement } from "@/types/Achievement";

export default function AchievementScreen() {
  const {
    user,
    collection,
    observations,
  } = useUserStore();

  const achievements = getAchievements(
    user,
    collection,
    observations
  );

  const unlockedCount =
    achievements.filter(
      (achievement) =>
        achievement.unlocked
    ).length;

  return (
    <View style={styles.container}>

      {/* Header */}

      <View style={styles.header}>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ‹
          </Text>
        </Pressable>

        <View>
          <Text style={styles.title}>
            Achievements
          </Text>

          <Text style={styles.subtitle}>
            {unlockedCount} / {achievements.length} unlocked
          </Text>
        </View>

      </View>


      {/* Progress */}

      <View style={styles.progressCard}>

        <View style={styles.progressHeader}>

          <Text style={styles.progressTitle}>
            Your Progress
          </Text>

          <Text style={styles.progressCount}>
            {unlockedCount}/{achievements.length}
          </Text>

        </View>

        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  achievements.length === 0
                    ? 0
                    : (unlockedCount /
                        achievements.length) *
                      100
                }%`,
              },
            ]}
          />
        </View>

      </View>


      {/* Achievement List */}

      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <AchievementCard
            achievement={item}
          />
        )}
      />

    </View>
  );
}


/* -------------------------------- */
/* Achievement Card */
/* -------------------------------- */

function AchievementCard({
  achievement,
}: {
  achievement: Achievement;
}) {
  const progress = Math.min(
    achievement.current /
      achievement.target,
    1
  );

  return (
    <View
      style={[
        styles.card,
        !achievement.unlocked &&
          styles.lockedCard,
      ]}
    >

      {/* Icon */}

      <View
        style={[
          styles.iconContainer,
          achievement.unlocked
            ? styles.unlockedIcon
            : styles.lockedIcon,
        ]}
      >
        <Text style={styles.icon}>
          {achievement.unlocked
            ? achievement.icon
            : "🔒"}
        </Text>
      </View>


      {/* Content */}

      <View style={styles.info}>

        <View style={styles.titleRow}>

          <Text
            style={[
              styles.cardTitle,
              !achievement.unlocked &&
                styles.lockedText,
            ]}
            numberOfLines={1}
          >
            {achievement.title}
          </Text>

          {achievement.unlocked && (
            <Text style={styles.check}>
              ✓
            </Text>
          )}

        </View>

        <Text style={styles.description}>
          {achievement.description}
        </Text>


        {/* Progress */}

        {!achievement.unlocked && (
          <View style={styles.progressSection}>

            <View style={styles.smallProgressBackground}>
              <View
                style={[
                  styles.smallProgressFill,
                  {
                    width: `${progress * 100}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.progressText}>
              {Math.min(
                achievement.current,
                achievement.target
              )}{" "}
              / {achievement.target}
            </Text>

          </View>
        )}


        {/* Reward */}

        <Text style={styles.reward}>
          +{achievement.rewardXP} XP
        </Text>

      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  backText: {
    color: Colors.text,
    fontSize: 30,
    lineHeight: 32,
  },

  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: "800",
  },

  subtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },

  progressCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    padding: 17,
    borderRadius: 18,
    marginBottom: 15,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  progressTitle: {
    color: Colors.text,
    fontWeight: "700",
  },

  progressCount: {
    color: Colors.primary,
    fontWeight: "800",
  },

  progressBackground: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.background,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
  },

  lockedCard: {
    opacity: 0.65,
  },

  iconContainer: {
    width: 65,
    height: 65,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  unlockedIcon: {
    backgroundColor: Colors.background,
  },

  lockedIcon: {
    backgroundColor: Colors.background,
  },

  icon: {
    fontSize: 32,
  },

  info: {
    flex: 1,
    marginLeft: 14,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "800",
    flex: 1,
  },

  lockedText: {
    color: Colors.textSecondary,
  },

  check: {
    color: Colors.success,
    fontSize: 18,
    fontWeight: "900",
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },

  smallProgressBackground: {
    height: 6,
    flex: 1,
    borderRadius: 3,
    backgroundColor: Colors.background,
    overflow: "hidden",
  },

  smallProgressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
  },

  progressText: {
    color: Colors.textSecondary,
    fontSize: 10,
    marginLeft: 8,
  },

  reward: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 7,
  },
});