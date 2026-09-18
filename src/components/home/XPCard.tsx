import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

interface Props {
  level: number;
  xp: number;
  nextLevelXp: number;
}

export default function XPCard({
  level,
  xp,
  nextLevelXp,
}: Props) {
  const progress = Math.min(
    xp / nextLevelXp,
    1
  );

  const remainingXP = Math.max(
    nextLevelXp - xp,
    0
  );

  return (
    <View style={styles.card}>

      {/* Header */}
      <View style={styles.header}>

        <View>
          <Text style={styles.eyebrow}>
            CURRENT LEVEL
          </Text>

          <View style={styles.levelRow}>
            <Text style={styles.level}>
              {level}
            </Text>

            <Text style={styles.levelLabel}>
              LEVEL
            </Text>
          </View>
        </View>

        <View style={styles.xpContainer}>
          <Text style={styles.xp}>
            {xp.toLocaleString()}
          </Text>

          <Text style={styles.xpLabel}>
            TOTAL XP
          </Text>
        </View>

      </View>

      {/* Progress */}
      <View style={styles.progressSection}>

        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            PROGRESS
          </Text>

          <Text style={styles.remaining}>
            {remainingXP.toLocaleString()} XP to next
          </Text>
        </View>

        <View style={styles.bar}>
          <View
            style={[
              styles.progress,
              {
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,

    borderRadius: Radius.card,

    padding: Spacing.card,

    marginTop: Spacing.md,

    borderWidth: 1,
    borderColor: Colors.border,

    ...Shadows.small,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  eyebrow: {
    color: Colors.textSecondary,
    ...Typography.label,
  },

  levelRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: Spacing.xs,
  },

  level: {
    color: Colors.text,
    ...Typography.numberLarge,
  },

  levelLabel: {
    color: Colors.textSecondary,
    fontFamily:
      Typography.fontFamily.semiBold,
    fontSize: 12,
    marginLeft: Spacing.sm,
  },

  xpContainer: {
    alignItems: "flex-end",
  },

  xp: {
    color: Colors.text,
    ...Typography.numberMedium,
  },

  xpLabel: {
    color: Colors.textMuted,
    ...Typography.label,
    marginTop: 2,
  },

  progressSection: {
    marginTop: Spacing.xl,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: Spacing.sm,
  },

  progressLabel: {
    color: Colors.textSecondary,
    ...Typography.label,
  },

  remaining: {
    color: Colors.textMuted,
    ...Typography.caption,
  },

  bar: {
    height: 7,

    backgroundColor: Colors.surfaceLight,

    borderRadius: Radius.pill,

    overflow: "hidden",
  },

  progress: {
    height: "100%",

    backgroundColor: Colors.primary,

    borderRadius: Radius.pill,
  },
});