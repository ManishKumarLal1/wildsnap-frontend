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
  streak: number;
}

export default function StreakCard({
  streak,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>S</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>
          CURRENT STREAK
        </Text>

        <View style={styles.streakRow}>
          <Text style={styles.number}>
            {streak}
          </Text>

          <Text style={styles.days}>
            {streak === 1 ? "day" : "days"}
          </Text>
        </View>

        <Text style={styles.subtitle}>
          Keep exploring every day
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.card,
    marginTop: Spacing.xl,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: Colors.border,

    ...Shadows.small,
  },

  iconContainer: {
    marginRight: Spacing.lg,
  },

  icon: {
    width: 52,
    height: 52,

    borderRadius: Radius.md,

    backgroundColor: Colors.primary,

    alignItems: "center",
    justifyContent: "center",
  },

  iconText: {
    color: Colors.white,
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
  },

  content: {
    flex: 1,
  },

  label: {
    color: Colors.textSecondary,
    ...Typography.label,
  },

  streakRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: Spacing.xs,
  },

  number: {
    color: Colors.text,
    ...Typography.numberMedium,
  },

  days: {
    color: Colors.textSecondary,
    ...Typography.bodyMedium,
    marginLeft: Spacing.sm,
  },

  subtitle: {
    color: Colors.textMuted,
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
});