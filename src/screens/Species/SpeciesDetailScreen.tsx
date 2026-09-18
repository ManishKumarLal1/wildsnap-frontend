import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";

import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

import { getWildDex, DexSpecies } from "@/api/dex";

export default function SpeciesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [species, setSpecies] = useState<DexSpecies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getWildDex();

        const foundSpecies = data.species.find(
          (item) => item.id === id
        );

        if (!foundSpecies) {
          setError("Species not found.");
          return;
        }

        setSpecies(foundSpecies);
      } catch (error) {
        console.error("Species detail error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load species."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSpecies();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="small"
          color={Colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading species...
        </Text>
      </View>
    );
  }

  if (error || !species) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="alert-circle-outline"
          size={42}
          color={Colors.textMuted}
        />

        <Text style={styles.errorTitle}>
          Species unavailable
        </Text>

        <Text style={styles.errorText}>
          {error || "Unable to load this species."}
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  const rarityColor =
    Colors.rarity[
      species.rarity.toLowerCase() as keyof typeof Colors.rarity
    ] ?? Colors.textMuted;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Back */}
      <Pressable
        style={styles.back}
        onPress={() => router.back()}
      >
        <Ionicons
          name="arrow-back"
          size={20}
          color={Colors.text}
        />

        <Text style={styles.backText}>
          Wild Dex
        </Text>
      </Pressable>

      {/* Hero */}
      <View style={styles.hero}>
        {species.image_url ? (
          <Image
            source={{ uri: species.image_url }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.emptyImage}>
            <Ionicons
              name="image-outline"
              size={54}
              color={Colors.textMuted}
            />
          </View>
        )}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          {species.category.toUpperCase()}
        </Text>

        <Text style={styles.name}>
          {species.name}
        </Text>

        <Text style={styles.scientificName}>
          {species.scientific_name}
        </Text>
      </View>

      {/* Rarity */}
      <View style={styles.rarityRow}>
        <View style={styles.rarityContainer}>
          <View
            style={[
              styles.rarityDot,
              { backgroundColor: rarityColor },
            ]}
          />

          <Text
            style={[
              styles.rarity,
              { color: rarityColor },
            ]}
          >
            {species.rarity}
          </Text>
        </View>

        <View style={styles.discoveryStatus}>
          <Ionicons
            name={
              species.discovered
                ? "checkmark-circle"
                : "lock-closed"
            }
            size={15}
            color={
              species.discovered
                ? Colors.success
                : Colors.textMuted
            }
          />

          <Text style={styles.discoveryText}>
            {species.discovered
              ? "Discovered"
              : "Undiscovered"}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <Stat
          icon="repeat-outline"
          label="Discoveries"
          value={species.discovery_count.toString()}
        />

        <Stat
          icon="leaf-outline"
          label="Category"
          value={species.category}
        />

        <Stat
          icon="shield-checkmark-outline"
          label="Status"
          value={species.conservation_status}
        />
      </View>

      {/* About */}
      <Text style={styles.sectionTitle}>
        About
      </Text>

      <View style={styles.card}>
        <Text style={styles.description}>
          {species.description}
        </Text>
      </View>

      {/* Habitat */}
      <Text style={styles.sectionTitle}>
        Habitat
      </Text>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={18}
            color={Colors.textSecondary}
          />

          <Text style={styles.description}>
            {species.habitat}
          </Text>
        </View>
      </View>

      {/* Diet */}
      <Text style={styles.sectionTitle}>
        Diet
      </Text>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Ionicons
            name="restaurant-outline"
            size={18}
            color={Colors.textSecondary}
          />

          <Text style={styles.description}>
            {species.diet}
          </Text>
        </View>
      </View>

      {/* Discover */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => router.push("/camera")}
      >
        <Ionicons
          name="camera-outline"
          size={20}
          color={Colors.white}
        />

        <Text style={styles.buttonText}>
          Discover Again
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.stat}>
      <Ionicons
        name={icon}
        size={18}
        color={Colors.textSecondary}
      />

      <Text
        style={styles.statValue}
        numberOfLines={1}
      >
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: Spacing.screen,
    paddingTop: Spacing.xl,
    paddingBottom: 110,
  },

  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  backText: {
    color: Colors.textSecondary,
    ...Typography.bodyMedium,
  },

  hero: {
    height: 300,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  emptyImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceLight,
  },

  header: {
    marginTop: Spacing.xxl,
  },

  eyebrow: {
    color: Colors.textMuted,
    ...Typography.label,
  },

  name: {
    color: Colors.text,
    ...Typography.display,
    marginTop: Spacing.xs,
  },

  scientificName: {
    color: Colors.textSecondary,
    ...Typography.body,
    fontStyle: "italic",
    marginTop: Spacing.xs,
  },

  rarityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.lg,
  },

  rarityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
    marginRight: Spacing.sm,
  },

  rarity: {
    ...Typography.bodyMedium,
  },

  discoveryStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  discoveryText: {
    color: Colors.textSecondary,
    ...Typography.captionMedium,
  },

  stats: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },

  stat: {
    flex: 1,
    minHeight: 92,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },

  statValue: {
    color: Colors.text,
    ...Typography.bodyMedium,
    marginTop: Spacing.sm,
  },

  statLabel: {
    color: Colors.textMuted,
    ...Typography.caption,
    marginTop: Spacing.xs,
  },

  sectionTitle: {
    color: Colors.text,
    ...Typography.h3,
    marginTop: Spacing.xxxl,
    marginBottom: Spacing.md,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: Spacing.cardLarge,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },

  description: {
    flex: 1,
    color: Colors.textSecondary,
    ...Typography.body,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },

  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    minHeight: 54,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xxxl,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.sm,
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: Colors.white,
    ...Typography.button,
  },

  center: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xxxl,
  },

  loadingText: {
    color: Colors.textSecondary,
    ...Typography.body,
    marginTop: Spacing.md,
  },

  errorTitle: {
    color: Colors.text,
    ...Typography.h3,
    marginTop: Spacing.lg,
  },

  errorText: {
    color: Colors.textSecondary,
    ...Typography.body,
    textAlign: "center",
    marginTop: Spacing.sm,
  },

  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.xl,
  },

  backButtonText: {
    color: Colors.white,
    ...Typography.button,
  },
});