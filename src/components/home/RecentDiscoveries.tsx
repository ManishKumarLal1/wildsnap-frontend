import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

interface Discovery {
  id: string;
  name: string;
  rarity: string;
  emoji: string;
}

interface Props {
  discoveries: Discovery[];
}

export default function RecentDiscoveries({
  discoveries,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>
            YOUR COLLECTION
          </Text>

          <Text style={styles.heading}>
            Recent Discoveries
          </Text>
        </View>

        <Pressable
  onPress={() =>
    router.push("/observation/history")
  }
  style={({ pressed }) => [
    styles.viewAllButton,
    pressed && styles.viewAllPressed,
  ]}
>
          <Text style={styles.viewAll}>
           JOURNAL
          </Text>

          <Ionicons
            name="arrow-forward"
            size={14}
            color={Colors.text}
          />
        </Pressable>
      </View>

      {/* Discoveries */}

      {discoveries.length > 0 ? (
        <View style={styles.row}>
          {discoveries.map((item) => (
            <View
              key={item.id}
              style={styles.card}
            >
              <View style={styles.imageContainer}>
                <Text style={styles.emoji}>
                  {item.emoji}
                </Text>
              </View>

              <Text
                style={styles.name}
                numberOfLines={1}
              >
                {item.name}
              </Text>

              <View style={styles.rarityRow}>
                <View style={styles.rarityDot} />

                <Text style={styles.rarity}>
                  {item.rarity}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="paw-outline"
              size={24}
              color={Colors.textSecondary}
            />
          </View>

          <View>
            <Text style={styles.emptyTitle}>
              No discoveries yet
            </Text>

            <Text style={styles.emptySubtitle}>
              Capture your first wild species
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.xxl,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",

    marginBottom: Spacing.md,
  },

  eyebrow: {
    color: Colors.textMuted,
    ...Typography.label,
    marginBottom: 3,
  },

  heading: {
    color: Colors.text,
    ...Typography.h3,
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,

    paddingVertical: Spacing.xs,
  },

  viewAllPressed: {
    opacity: 0.5,
  },

  viewAll: {
    color: Colors.text,
    ...Typography.label,
  },

  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  card: {
    flex: 1,

    backgroundColor: Colors.surface,

    borderRadius: Radius.card,

    padding: Spacing.md,

    borderWidth: 1,
    borderColor: Colors.border,

    ...Shadows.small,
  },

  imageContainer: {
    height: 82,

    borderRadius: Radius.md,

    backgroundColor: Colors.surfaceLight,

    alignItems: "center",
    justifyContent: "center",

    overflow: "hidden",
  },

  emoji: {
    fontSize: 42,
  },

  name: {
    color: Colors.text,
    ...Typography.bodyMedium,

    marginTop: Spacing.md,
  },

  rarityRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: Spacing.xs,
  },

  rarityDot: {
    width: 6,
    height: 6,

    borderRadius: Radius.pill,

    backgroundColor: Colors.textMuted,

    marginRight: Spacing.xs,
  },

  rarity: {
    color: Colors.textSecondary,
    ...Typography.caption,
  },

  emptyCard: {
    backgroundColor: Colors.surface,

    borderRadius: Radius.card,

    borderWidth: 1,
    borderColor: Colors.border,

    padding: Spacing.lg,

    flexDirection: "row",
    alignItems: "center",

    ...Shadows.small,
  },

  emptyIcon: {
    width: 48,
    height: 48,

    borderRadius: Radius.md,

    backgroundColor: Colors.surfaceLight,

    alignItems: "center",
    justifyContent: "center",

    marginRight: Spacing.md,
  },

  emptyTitle: {
    color: Colors.text,
    ...Typography.bodyMedium,
  },

  emptySubtitle: {
    color: Colors.textSecondary,
    ...Typography.caption,

    marginTop: 2,
  },
});