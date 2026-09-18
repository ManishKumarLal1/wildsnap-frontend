import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";

import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

// API imports
import { createObservation } from "@/api/observations";
import { getSpeciesByName } from "@/api/species";

// Store imports
import { useUserStore } from "@/store/userStore";

// Utils & Theme
import { calculateObservationXP, getRarityBonus } from "@/utils/xp";
import { Colors } from "@/theme/colors";
import { Species } from "@/types/Species";

export default function ResultScreen() {
  const { species, scientificName, confidence, imageUrl, cloudinaryPublicId } =
    useLocalSearchParams<{
      species: string;
      scientificName: string;
      confidence: string;
      imageUrl: string;
      cloudinaryPublicId: string;
    }>();

const {
  collection,
  syncObservationFromBackend,
} = useUserStore();

  const [dbSpecies, setDbSpecies] = useState<Species | null>(null);
  const [isLoadingSpecies, setIsLoadingSpecies] = useState(true);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
 const [rewardData, setRewardData] = useState<{
  xpEarned: number;
  totalXp: number;
  level: number;
  streak: number;
  firstDiscovery: boolean;
} | null>(null);
  const isNewSpecies = dbSpecies
    ? !collection.some((item) => item.id === dbSpecies.id)
    : false;

  const totalXP = dbSpecies
    ? calculateObservationXP(dbSpecies.rarity, isNewSpecies)
    : 0;
    

const displayXP = rewardData?.xpEarned ?? totalXP;

  // --------------------------------
  // Fetch real species data on mount
  // --------------------------------
  useEffect(() => {
    const fetchSpeciesData = async () => {
      if (!species) return;
      try {
        setIsLoadingSpecies(true);
        const data = await getSpeciesByName(species);
        setDbSpecies(data);
      } catch (error) {
        Alert.alert(
          "Species Not Found",
          `We couldn't find "${species}" in our database.`
        );
        router.back();
      } finally {
        setIsLoadingSpecies(false);
      }
    };

    fetchSpeciesData();
  }, [species]);

  // --------------------------------
  // Dynamic XP Calculation
  // --------------------------------



  // --------------------------------
  // Add to Collection
  // --------------------------------
  const handleAddToCollection = async () => {
  if (saving || saved || !dbSpecies) return;

  if (!imageUrl || !cloudinaryPublicId) {
    Alert.alert(
      "Error",
      "Uploaded image information is missing."
    );
    return;
  }

  try {
    setSaving(true);

    const result = await createObservation({
      speciesId: dbSpecies.id,
      imageUrl,
      cloudinaryPublicId,
      confidence: Number(confidence) || 0,
    });

    const backendObservation = result.observation;
    const rewards = result.rewards;
    const backendCollection = result.collection;

    const newObservation = {
      id: backendObservation.id,
      speciesId: backendObservation.species_id,
      speciesName: dbSpecies.name,
      scientificName: dbSpecies.scientificName,
      rarity: dbSpecies.rarity,
      imageUrl: backendObservation.image_url,
      cloudinaryPublicId:
        backendObservation.cloudinary_public_id,
      confidence: Number(backendObservation.confidence),
      xpEarned: rewards.xpEarned,
      createdAt: backendObservation.created_at,
    };

    syncObservationFromBackend(
      newObservation,
      {
        xpEarned: rewards.xpEarned,
        totalXp: rewards.totalXp,
        level: rewards.level,
        streak: rewards.streak,
        firstDiscovery: rewards.firstDiscovery,
      },
      {
        speciesId: backendCollection.speciesId,
        discoveryCount: backendCollection.discoveryCount,
      }
    );

    setRewardData(rewards);
    setSaved(true);
  } catch (error) {
    console.error("Save observation error:", error);

    Alert.alert(
      "Failed",
      error instanceof Error
        ? error.message
        : "Failed to save observation."
    );
  } finally {
    setSaving(false);
  }
};

  // Show loading spinner while fetching from DB
  if (isLoadingSpecies) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading species data...</Text>
      </View>
    );
  }

  if (!dbSpecies) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Dynamic Emoji */}
      <View style={styles.imageContainer}>
  {imageUrl ? (
    <Image
      source={{ uri: imageUrl }}
      style={styles.resultImage}
      resizeMode="cover"
    />
  ) : (
    <View style={styles.imageFallback}>
      <Text style={styles.animal}>
        {dbSpecies.emoji}
      </Text>
    </View>
  )}

  <View style={styles.identifiedBadge}>
    <Ionicons
      name="checkmark-circle"
      size={15}
      color={Colors.white}
    />

    <Text style={styles.identifiedBadgeText}>
      IDENTIFIED
    </Text>
  </View>
</View>

      <Text style={styles.success}>Wildlife Identified!</Text>

      {/* Dynamic Name */}
      <Text style={styles.species}>{dbSpecies.name}</Text>
      <Text style={styles.scientific}>{dbSpecies.scientificName}</Text>

      <View style={styles.confidence}>
        <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
        <Text style={styles.confidenceText}>
          {(Number(confidence) * 100).toFixed(1)}% identification confidence
        </Text>
      </View>

      {/* Dynamic Rarity */}
      <View style={styles.rarityCard}>
        <Text style={styles.rarityLabel}>RARITY</Text>
        <Text style={styles.rarity}>⭐ {dbSpecies.rarity}</Text>
      </View>

      <View style={styles.xpCard}>
<Text style={styles.xp}>+{displayXP}</Text>
  <Text style={styles.xpText}>Wildlife discovered!</Text>
</View>

      {/* XP Breakdown */}
      <View style={styles.breakdownCard}>
        <Text style={styles.breakdownTitle}>XP Breakdown</Text>
        
        <XPRow label="Observation XP" value={50} />

        {getRarityBonus(dbSpecies.rarity) > 0 && (
          <XPRow
            label={`${dbSpecies.rarity} Bonus`}
            value={getRarityBonus(dbSpecies.rarity)}
          />
        )}

        {(rewardData?.firstDiscovery ?? isNewSpecies) && <XPRow label="New Species Bonus" value={100} />}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total XP</Text>
         <Text style={styles.totalValue}>+{displayXP}</Text>
        </View>
      </View>

     {(rewardData?.firstDiscovery ?? isNewSpecies) &&  (
        <View style={styles.newSpecies}>
          <Text style={styles.newSpeciesIcon}>🎉</Text>
          <View style={styles.newSpeciesContent}>
            <Text style={styles.newSpeciesTitle}>NEW SPECIES!</Text>
            <Text style={styles.newSpeciesText}>Added to your collection</Text>
          </View>
        </View>
      )}

      {/* Add Button */}
      <Pressable
        style={[styles.button, (saving || saved) && styles.buttonDisabled]}
        onPress={handleAddToCollection}
        disabled={saving || saved}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            {saved ? "Added to Collection ✓" : "Add to Collection"}
          </Text>
        )}
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.replace("/(tabs)/camera")}
      >
        <Text style={styles.secondaryText}>Capture Another</Text>
      </Pressable>
    </ScrollView>
  );
}

function XPRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.xpRow}>
      <Text style={styles.xpRowLabel}>{label}</Text>
      <Text style={styles.xpRowValue}>+{value} XP</Text>
    </View>
  );
}

// ... Keep your existing Styles exactly as they were ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { justifyContent: "center", alignItems: "center" },
  loadingText: { color: Colors.textSecondary, marginTop: 10 },
  content: { alignItems: "center", padding: 25, paddingTop: 55, paddingBottom: 60 },
  iconContainer: { width: 130, height: 130, borderRadius: 65, backgroundColor: Colors.surface, alignItems: "center", justifyContent: "center" },
  animal: { fontSize: 70 },
  success: { color: Colors.success, fontSize: 14, fontWeight: "700", marginTop: 22 },
  species: { color: Colors.text, fontSize: 30, fontWeight: "800", textAlign: "center", marginTop: 8 },
  scientific: { color: Colors.textSecondary, fontSize: 15, fontStyle: "italic", marginTop: 5 },
  confidence: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 15 },
  confidenceText: { color: Colors.textSecondary },
  rarityCard: { width: "100%", backgroundColor: Colors.surface, borderRadius: 16, padding: 18, alignItems: "center", marginTop: 22 },
  rarityLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: "700" },
  rarity: { color: Colors.warning, fontSize: 22, fontWeight: "800", marginTop: 5 },
  xpCard: { alignItems: "center", marginTop: 18 },
  xp: { color: Colors.primary, fontSize: 36, fontWeight: "900" },
  xpText: { color: Colors.textSecondary, marginTop: 3 },
  breakdownCard: { width: "100%", backgroundColor: Colors.surface, borderRadius: 18, padding: 18, marginTop: 18 },
  breakdownTitle: { color: Colors.text, fontSize: 17, fontWeight: "800", marginBottom: 12 },
  xpRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 7 },
  xpRowLabel: { color: Colors.textSecondary, fontSize: 14 },
  xpRowValue: { color: Colors.primary, fontSize: 14, fontWeight: "700" },
  divider: { height: 1, backgroundColor: Colors.background, marginVertical: 8 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { color: Colors.text, fontSize: 15, fontWeight: "800" },
  totalValue: { color: Colors.primary, fontSize: 18, fontWeight: "900" },
  newSpecies: { width: "100%", flexDirection: "row", alignItems: "center", backgroundColor: Colors.surface, borderRadius: 16, padding: 15, marginTop: 12 },
  newSpeciesIcon: { fontSize: 30, marginRight: 12 },
  newSpeciesContent: { flex: 1 },
  newSpeciesTitle: { color: Colors.success, fontSize: 14, fontWeight: "900" },
  newSpeciesText: { color: Colors.textSecondary, fontSize: 12, marginTop: 3 },
  button: { width: "100%", backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: "center", marginTop: 22 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  secondaryButton: { marginTop: 15 },
  secondaryText: { color: Colors.primary, fontWeight: "700" },
  imageContainer: {
  width: "100%",
  height: 280,
  borderRadius: 20,
  overflow: "hidden",
  backgroundColor: Colors.surface,
  borderWidth: 1,
  borderColor: Colors.border,
  position: "relative",
},

resultImage: {
  width: "100%",
  height: "100%",
},

imageFallback: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
},

identifiedBadge: {
  position: "absolute",
  top: 14,
  left: 14,
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  backgroundColor: "rgba(0,0,0,0.68)",
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 999,
},

identifiedBadgeText: {
  color: Colors.white,
  fontSize: 10,
  fontWeight: "700",
  letterSpacing: 0.8,
},
});