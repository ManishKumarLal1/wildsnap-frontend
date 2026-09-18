import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";

import { useEffect, useState } from "react";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

import { useUserStore } from "@/store/userStore";
import { getMyObservations } from "@/api/observations";

import { Observation } from "@/types/Observation";

export default function ObservationHistoryScreen() {
  const { collection } = useUserStore();

  const [observations, setObservations] =
    useState<Observation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    loadObservations();
  }, []);

  const loadObservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getMyObservations();

      const mappedObservations: Observation[] =
        data.map((item: any) => ({
          id: item.id,

          speciesId: item.species_id,

          speciesName: item.species_name,

          scientificName:
            item.scientific_name,

          confidence: Number(
            item.confidence
          ),

          rarity: item.rarity,

          xpEarned: item.xp_earned,

          imageUrl: item.image_url,

          createdAt: item.created_at,

          location:
            item.latitude !== null &&
            item.longitude !== null
              ? `${item.latitude}, ${item.longitude}`
              : undefined,
        }));

      setObservations(mappedObservations);
    } catch (error) {
      console.error(
        "Failed to load observations:",
        error
      );

      setError(
        "Unable to load your observations."
      );
    } finally {
      setLoading(false);
    }
  };

  const sortedObservations =
    [...observations].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

  /*
   * Loading
   */

  if (loading) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.stateIconContainer}>
          <Ionicons
            name="book-outline"
            size={32}
            color={Colors.primary}
          />
        </View>

        <ActivityIndicator
          size="small"
          color={Colors.primary}
          style={styles.stateSpinner}
        />

        <Text style={styles.stateTitle}>
          Loading your journal
        </Text>

        <Text style={styles.stateText}>
          Fetching your wildlife discoveries...
        </Text>
      </View>
    );
  }

  /*
   * Error
   */

  if (error) {
    return (
      <View style={styles.stateContainer}>
        <View style={styles.stateIconContainer}>
          <Ionicons
            name="cloud-offline-outline"
            size={34}
            color={Colors.textSecondary}
          />
        </View>

        <Text style={styles.stateTitle}>
          Couldn't load Journal
        </Text>

        <Text style={styles.stateText}>
          {error}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={loadObservations}
        >
          <Ionicons
            name="refresh-outline"
            size={18}
            color={Colors.white}
          />

          <Text style={styles.retryButtonText}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={Colors.text}
          />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>
            My Observations
          </Text>

          <Text style={styles.subtitle}>
            {observations.length}{" "}
            {observations.length === 1
              ? "observation"
              : "observations"}
          </Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={sortedObservations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          sortedObservations.length === 0
            ? styles.emptyList
            : styles.list
        }
        renderItem={({ item }) => (
          <ObservationCard
            observation={item}
            emoji={
              collection.find(
                (species) =>
                  species.id === item.speciesId
              )?.emoji ?? "🐾"
            }
          />
        )}
        ListEmptyComponent={<EmptyState />}
      />
    </View>
  );
}

/* -------------------------------- */
/* Observation Card */
/* -------------------------------- */

function ObservationCard({
  observation,
  emoji,
}: {
  observation: Observation;
  emoji: string;
}) {
  const date = new Date(observation.createdAt);

  const formattedDate =
    date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formattedTime =
    date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <View style={styles.card}>
      {/* Image */}
      <View style={styles.imageContainer}>
        {observation.imageUrl ? (
          <Image
            source={{
              uri: observation.imageUrl,
            }}
            style={styles.image}
          />
        ) : (
          <Text style={styles.emoji}>
            {emoji}
          </Text>
        )}

        {/* XP badge */}
        <View style={styles.imageXpBadge}>
          <Ionicons
            name="star"
            size={11}
            color={Colors.primary}
          />

          <Text style={styles.imageXpText}>
            +{observation.xpEarned}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.info}>
        <Text
          style={styles.speciesName}
          numberOfLines={1}
        >
          {observation.speciesName}
        </Text>

        <Text
          style={styles.scientificName}
          numberOfLines={1}
        >
          {observation.scientificName}
        </Text>

        {/* Rarity + Confidence */}
        <View style={styles.metaRow}>
          <View style={styles.rarityBadge}>
            <Text style={styles.rarityText}>
              {observation.rarity}
            </Text>
          </View>

          <View style={styles.confidenceContainer}>
            <Ionicons
              name="sparkles-outline"
              size={12}
              color={Colors.textSecondary}
            />

            <Text style={styles.confidence}>
              {(
                observation.confidence * 100
              ).toFixed(1)}
              % match
            </Text>
          </View>
        </View>

        {/* Date */}
        <View style={styles.bottomRow}>
          <View style={styles.dateContainer}>
            <Ionicons
              name="calendar-outline"
              size={13}
              color={Colors.textMuted}
            />

            <Text style={styles.date}>
              {formattedDate}
            </Text>

            <Text style={styles.time}>
              {formattedTime}
            </Text>
          </View>
        </View>

        {/* Location */}
        {observation.location && (
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={13}
              color={Colors.textMuted}
            />

            <Text
              style={styles.location}
              numberOfLines={1}
            >
              {observation.location}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

/* -------------------------------- */
/* Empty State */
/* -------------------------------- */

function EmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIconContainer}>
        <Ionicons
          name="camera-outline"
          size={36}
          color={Colors.primary}
        />
      </View>

      <Text style={styles.emptyTitle}>
        No observations yet
      </Text>

      <Text style={styles.emptyText}>
        Start exploring wildlife and your
        discoveries will appear here.
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.captureButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={() =>
          router.push("/camera")
        }
      >
        <Ionicons
          name="camera-outline"
          size={18}
          color={Colors.white}
        />

        <Text style={styles.captureButtonText}>
          Capture Wildlife
        </Text>

        <Ionicons
          name="arrow-forward"
          size={17}
          color={Colors.white}
        />
      </Pressable>
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

  /* Header */

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.lg,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.small,
  },

  iconButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },

  headerText: {
    marginLeft: Spacing.md,
    flex: 1,
  },

  title: {
    color: Colors.text,
    ...Typography.h3,
  },

  subtitle: {
    color: Colors.textSecondary,
    ...Typography.caption,
    marginTop: Spacing.xs,
  },

  /* List */

  list: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.xxxl,
  },

  /* Card */

  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },

  imageContainer: {
    width: 92,
    height: 110,
    borderRadius: Radius.lg,
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

  emoji: {
    fontSize: 42,
  },

  imageXpBadge: {
    position: "absolute",
    bottom: Spacing.xs,
    left: Spacing.xs,
    right: Spacing.xs,
    height: 24,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.92)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },

  imageXpText: {
    color: Colors.primary,
    ...Typography.captionMedium,
  },

  info: {
    flex: 1,
    marginLeft: Spacing.md,
    minWidth: 0,
    paddingVertical: Spacing.xs,
  },

  speciesName: {
    color: Colors.text,
    ...Typography.bodyMedium,
  },

  scientificName: {
    color: Colors.textSecondary,
    ...Typography.caption,
    fontStyle: "italic",
    marginTop: 2,
  },

  /* Meta */

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },

  rarityBadge: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },

  rarityText: {
    color: Colors.warning,
    ...Typography.captionMedium,
  },

  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  confidence: {
    color: Colors.textSecondary,
    ...Typography.caption,
  },

  /* Date */

  bottomRow: {
    marginTop: Spacing.sm,
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  date: {
    color: Colors.textMuted,
    ...Typography.caption,
    marginLeft: Spacing.xs,
  },

  time: {
    color: Colors.textMuted,
    ...Typography.caption,
    marginLeft: Spacing.xs,
  },

  /* Location */

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },

  location: {
    color: Colors.textMuted,
    ...Typography.caption,
    marginLeft: Spacing.xs,
    flex: 1,
  },

  /* Empty */

  emptyList: {
    flexGrow: 1,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },

  emptyIconContainer: {
    width: 88,
    height: 88,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.small,
  },

  emptyTitle: {
    color: Colors.text,
    ...Typography.h3,
    textAlign: "center",
    marginTop: Spacing.xl,
  },

  emptyText: {
    color: Colors.textSecondary,
    ...Typography.body,
    textAlign: "center",
    lineHeight: 22,
    marginTop: Spacing.sm,
    maxWidth: 340,
  },

  captureButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    ...Shadows.small,
  },

  captureButtonText: {
    color: Colors.white,
    ...Typography.button,
  },

  /* Loading / Error */

  stateContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },

  stateIconContainer: {
    width: 76,
    height: 76,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.small,
  },

  stateSpinner: {
    marginTop: Spacing.xl,
  },

  stateTitle: {
    color: Colors.text,
    ...Typography.h3,
    textAlign: "center",
    marginTop: Spacing.md,
  },

  stateText: {
    color: Colors.textSecondary,
    ...Typography.body,
    textAlign: "center",
    lineHeight: 22,
    marginTop: Spacing.xs,
    maxWidth: 340,
  },

  retryButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    ...Shadows.small,
  },

  retryButtonText: {
    color: Colors.white,
    ...Typography.button,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});