import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

interface Props {
  discovered: number;
  total: number;
}

export default function CollectionHeader({
  discovered,
  total,
}: Props) {
  const percentage =
    total > 0
      ? Math.round((discovered / total) * 100)
      : 0;

  return (
    <View>
      {/* Header */}

      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            WILDLIFE DATABASE
          </Text>

          <Text style={styles.title}>
            Wild Dex
          </Text>

          <Text style={styles.subtitle}>
            Your personal record of the wild.
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons
            name="leaf-outline"
            size={21}
            color={Colors.text}
          />
        </View>
      </View>

      {/* Progress */}

      <View style={styles.progressCard}>
        <View style={styles.progressTop}>
          <View>
            <Text style={styles.progressLabel}>
              SPECIES DISCOVERED
            </Text>

            <View style={styles.countRow}>
              <Text style={styles.count}>
                {discovered}
              </Text>

              <Text style={styles.total}>
                / {total}
              </Text>
            </View>
          </View>

          <Text style={styles.percent}>
            {percentage}%
          </Text>
        </View>

        {/* Progress bar */}

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.progressHint}>
          {total - discovered > 0
            ? `${total - discovered} species left to discover`
            : "Dex complete"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  eyebrow: {
    color: Colors.textMuted,
    ...Typography.label,
  },

  title: {
    color: Colors.text,
    ...Typography.display,
    marginTop: Spacing.xs,
  },

  subtitle: {
    color: Colors.textSecondary,
    ...Typography.body,
    marginTop: Spacing.xs,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: Radius.md,

    backgroundColor: Colors.surface,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: Colors.border,

    ...Shadows.small,
  },

  /* Progress card */

  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,

    padding: Spacing.cardLarge,

    marginTop: Spacing.xl,

    borderWidth: 1,
    borderColor: Colors.border,

    ...Shadows.small,
  },

  progressTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  progressLabel: {
    color: Colors.textMuted,
    ...Typography.label,
  },

  countRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: Spacing.xs,
  },

  count: {
    color: Colors.text,
    ...Typography.numberLarge,
  },

  total: {
    color: Colors.textSecondary,
    ...Typography.bodyMedium,
    marginLeft: Spacing.xs,
  },

  percent: {
    color: Colors.text,
    ...Typography.numberMedium,
  },

  /* Progress */

  progressTrack: {
    height: 7,
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.pill,

    overflow: "hidden",

    marginTop: Spacing.xl,
  },

  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
  },

  progressHint: {
    color: Colors.textMuted,
    ...Typography.caption,
    marginTop: Spacing.sm,
  },
});