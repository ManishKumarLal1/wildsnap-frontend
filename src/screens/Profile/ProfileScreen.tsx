import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

import { useUserStore } from "@/store/userStore";

import XPBar from "@/components/profile/XPBar";

export default function ProfileScreen() {
  const {
    user,
    collection,
    observations,
  } = useUserStore();

  /*
   * Temporary MVP level system.
   * Later this can move to src/utils/xp.ts
   */
  const XP_PER_LEVEL = 1000;

  const level =
    Math.floor(user.xp / XP_PER_LEVEL) + 1;

  const currentLevelXP =
    (level - 1) * XP_PER_LEVEL;

  const xpIntoLevel =
    user.xp - currentLevelXP;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* -------------------------------- */}
      {/* Profile Header */}
      {/* -------------------------------- */}

      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.avatar}
          </Text>
        </View>

        <Text style={styles.username}>
          {user.username}
        </Text>

        <Text style={styles.level}>
          Level {level} · Wildlife Explorer
        </Text>

        {user.location ? (
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color={Colors.textSecondary}
            />

            <Text style={styles.location}>
              {user.location}
            </Text>
          </View>
        ) : null}
      </View>

      {/* -------------------------------- */}
      {/* Experience */}
      {/* -------------------------------- */}

      <View style={styles.experienceCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.eyebrow}>
              EXPERIENCE
            </Text>

            <Text style={styles.cardTitle}>
              Level {level}
            </Text>
          </View>

          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>
              LVL {level}
            </Text>
          </View>
        </View>

        <View style={styles.xpBarContainer}>
          <XPBar
            currentXP={xpIntoLevel}
            requiredXP={XP_PER_LEVEL}
          />
        </View>

        <View style={styles.xpFooter}>
          <Text style={styles.xpCurrent}>
            {xpIntoLevel.toLocaleString()} /{" "}
            {XP_PER_LEVEL.toLocaleString()} XP
          </Text>

          <Text style={styles.xpRemaining}>
            {Math.max(
              XP_PER_LEVEL - xpIntoLevel,
              0
            ).toLocaleString()}{" "}
            XP to next
          </Text>
        </View>
      </View>

      {/* -------------------------------- */}
      {/* Journey */}
      {/* -------------------------------- */}

      <SectionHeader title="YOUR JOURNEY" />

      <View style={styles.statsGrid}>
        <Stat
          icon="leaf-outline"
          value={collection.length}
          label="SPECIES"
        />

        <Stat
          icon="camera-outline"
          value={observations.length}
          label="OBSERVATIONS"
        />

        <Stat
          icon="flame-outline"
          value={user.streak}
          label="DAY STREAK"
        />

        <Stat
          icon="star-outline"
          value={user.xp}
          label="TOTAL XP"
        />
      </View>

      {/* -------------------------------- */}
      {/* Activity */}
      {/* -------------------------------- */}

      <SectionHeader title="YOUR ACTIVITY" />

      <Pressable
        style={({ pressed }) => [
          styles.activityButton,
          pressed && styles.pressed,
        ]}
        onPress={() =>
          router.push("/observation/history")
        }
      >
        <View style={styles.activityLeft}>
          <View style={styles.activityIcon}>
            <Ionicons
              name="book-outline"
              size={21}
              color={Colors.text}
            />
          </View>

          <View style={styles.activityText}>
            <Text style={styles.activityTitle}>
              Wildlife Journal
            </Text>

            <Text style={styles.activityDescription}>
              View all your wildlife discoveries
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={Colors.textMuted}
        />
      </Pressable>

      {/* -------------------------------- */}
      {/* Achievements */}
      {/* -------------------------------- */}

      <View style={styles.achievementHeader}>
        <Text style={styles.sectionTitle}>
          ACHIEVEMENTS
        </Text>

        <Pressable
          onPress={() =>
            router.push("/achievements")
          }
          hitSlop={8}
        >
          <Text style={styles.viewAll}>
            VIEW ALL
          </Text>
        </Pressable>
      </View>

      <View style={styles.achievementRow}>
        <Achievement
          icon="leaf-outline"
          title="Explorer"
          description="Discover 10 species"
        />

        <Achievement
          icon="flame-outline"
          title="On Fire"
          description="7 day streak"
        />
      </View>

      <View style={styles.achievementRow}>
        <Achievement
          icon="eye-outline"
          title="Bird Watcher"
          description="Discover 5 birds"
        />

        <Achievement
          icon="globe-outline"
          title="Explorer"
          description="Visit 3 locations"
        />
      </View>

      {/* -------------------------------- */}
      {/* Settings */}
      {/* -------------------------------- */}

      <View style={styles.accountSection}>
        <Text style={styles.sectionTitle}>
          ACCOUNT
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.settingsButton,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            router.push("/settings")
          }
        >
          <View style={styles.settingsLeft}>
            <View style={styles.settingsIcon}>
              <Ionicons
                name="settings-outline"
                size={20}
                color={Colors.text}
              />
            </View>

            <View>
              <Text style={styles.settingsTitle}>
                Settings
              </Text>

              <Text style={styles.settingsDescription}>
                Manage your account and preferences
              </Text>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={Colors.textMuted}
          />
        </Pressable>
      </View>
    </ScrollView>
  );
}

/* -------------------------------- */
/* Section Header */
/* -------------------------------- */

function SectionHeader({
  title,
}: {
  title: string;
}) {
  return (
    <Text style={styles.sectionTitle}>
      {title}
    </Text>
  );
}

/* -------------------------------- */
/* Stat Component */
/* -------------------------------- */

function Stat({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
}) {
  return (
    <View style={styles.stat}>
      <View style={styles.statIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={Colors.textSecondary}
        />
      </View>

      <Text style={styles.statValue}>
        {value.toLocaleString()}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

/* -------------------------------- */
/* Achievement Component */
/* -------------------------------- */

function Achievement({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.achievement}>
      <View style={styles.achievementIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={Colors.textSecondary}
        />
      </View>

      <View style={styles.achievementText}>
        <Text
          style={styles.achievementTitle}
          numberOfLines={1}
        >
          {title}
        </Text>

        <Text
          style={styles.achievementDescription}
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

/* -------------------------------- */
/* Styles */
/* -------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: 28,
    paddingBottom: 100,
  },

  /* Profile */

  profileHeader: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.small,
  },

  avatarText: {
    fontSize: 44,
  },

  username: {
    color: Colors.text,
    ...Typography.h1,
    marginTop: Spacing.md,
  },

  level: {
    color: Colors.textSecondary,
    ...Typography.body,
    marginTop: Spacing.xs,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
  },

  location: {
    color: Colors.textSecondary,
    ...Typography.caption,
    marginLeft: 4,
  },

  /* Experience */

  experienceCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.cardLarge,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  eyebrow: {
    color: Colors.textMuted,
    ...Typography.label,
  },

  cardTitle: {
    color: Colors.text,
    ...Typography.h3,
    marginTop: Spacing.xs,
  },

  levelBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },

  levelBadgeText: {
    color: Colors.white,
    ...Typography.captionMedium,
    letterSpacing: 0.5,
  },

  xpBarContainer: {
    marginTop: Spacing.xl,
  },

  xpFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },

  xpCurrent: {
    color: Colors.textSecondary,
    ...Typography.captionMedium,
  },

  xpRemaining: {
    color: Colors.textMuted,
    ...Typography.caption,
  },

  /* Sections */

  sectionTitle: {
    color: Colors.textSecondary,
    ...Typography.label,
    marginTop: Spacing.section,
    marginBottom: Spacing.md,
  },

  /* Stats */

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  stat: {
    width: "48%",
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.card,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },

  statIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },

  statValue: {
    color: Colors.text,
    ...Typography.numberMedium,
    marginTop: Spacing.md,
  },

  statLabel: {
    color: Colors.textMuted,
    ...Typography.label,
    marginTop: Spacing.xs,
  },

  /* Activity */

  activityButton: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },

  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },

  activityText: {
    flex: 1,
  },

  activityTitle: {
    color: Colors.text,
    ...Typography.bodyMedium,
  },

  activityDescription: {
    color: Colors.textSecondary,
    ...Typography.caption,
    marginTop: 2,
  },

  /* Achievements */

  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.md,
  },

  viewAll: {
    color: Colors.text,
    ...Typography.label,
  },

  achievementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  achievement: {
    width: "48%",
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
  },

  achievementIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },

  achievementText: {
    flex: 1,
  },

  achievementTitle: {
    color: Colors.text,
    ...Typography.bodyMedium,
  },

  achievementDescription: {
    color: Colors.textSecondary,
    ...Typography.caption,
    marginTop: 2,
  },

  /* Account */

  accountSection: {
    marginTop: Spacing.sm,
  },

  settingsButton: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
    marginBottom: Spacing.xl,
  },

  settingsLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  settingsIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },

  settingsTitle: {
    color: Colors.text,
    ...Typography.bodyMedium,
  },

  settingsDescription: {
    color: Colors.textSecondary,
    ...Typography.caption,
    marginTop: 2,
  },

  /* Press */

  pressed: {
    opacity: 0.65,
  },
});