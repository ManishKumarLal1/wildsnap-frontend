import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

import { DexSpecies } from "@/api/dex";

interface Props {
  species: DexSpecies;
  onPress: () => void;
}

export default function CollectionCard({
  species,
  onPress,
}: Props) {
  const discovered = species.discovered;

  const imageUrl = discovered
    ? species.image_url
    : species.silhouette_url;

  const rarityColor =
    Colors.rarity[
      species.rarity.toLowerCase() as keyof typeof Colors.rarity
    ] ?? Colors.textMuted;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        !discovered && styles.lockedCard,
        pressed && styles.pressed,
      ]}
    >
      {/* Image */}

      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[
              styles.image,
              !discovered && styles.silhouette,
            ]}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.noImage}>
            <Ionicons
              name={
                discovered
                  ? "image-outline"
                  : "help-outline"
              }
              size={34}
              color={Colors.textMuted}
            />
          </View>
        )}

        {/* Locked indicator */}

        {!discovered && (
          <View style={styles.lockBadge}>
            <Ionicons
              name="lock-closed"
              size={12}
              color={Colors.textSecondary}
            />
          </View>
        )}
      </View>

      {/* Species information */}

      <View style={styles.info}>
        <Text
          style={styles.name}
          numberOfLines={1}
        >
          {species.name}
        </Text>

        <View style={styles.rarityRow}>
          <View
            style={[
              styles.rarityDot,
              {
                backgroundColor: rarityColor,
              },
            ]}
          />

          <Text
            style={[
              styles.rarity,
              {
                color: rarityColor,
              },
            ]}
          >
            {species.rarity}
          </Text>
        </View>

        {discovered ? (
          <View style={styles.discoveryRow}>
            <Ionicons
              name="checkmark-circle"
              size={13}
              color={Colors.success}
            />

            <Text style={styles.count}>
              {species.discovery_count}{" "}
              {species.discovery_count === 1
                ? "discovery"
                : "discoveries"}
            </Text>
          </View>
        ) : (
          <Text style={styles.undiscovered}>
            Not discovered
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.lg,

    borderWidth: 1,
    borderColor: Colors.border,

    ...Shadows.small,
  },

  lockedCard: {
    opacity: 0.82,
  },

  pressed: {
    transform: [{ scale: 0.975 }],
    opacity: 0.9,
  },

  /* Image */

  imageContainer: {
    height: 138,
    borderRadius: Radius.image,
    backgroundColor: Colors.surfaceLight,

    alignItems: "center",
    justifyContent: "center",

    overflow: "hidden",

    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  silhouette: {
    opacity: 0.65,
  },

  noImage: {
    alignItems: "center",
    justifyContent: "center",
  },

  lockBadge: {
    position: "absolute",
    top: 8,
    right: 8,

    width: 26,
    height: 26,

    borderRadius: Radius.pill,

    backgroundColor:
      "rgba(255,255,255,0.88)",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: Colors.border,
  },

  /* Information */

  info: {
    paddingTop: Spacing.md,
  },

  name: {
    color: Colors.text,
    ...Typography.bodyMedium,
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
    marginRight: Spacing.xs,
  },

  rarity: {
    ...Typography.captionMedium,
  },

  discoveryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
  },

  count: {
    color: Colors.textSecondary,
    ...Typography.caption,
    marginLeft: 5,
  },

  undiscovered: {
    color: Colors.textMuted,
    ...Typography.caption,
    marginTop: Spacing.sm,
  },
});