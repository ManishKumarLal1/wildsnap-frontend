import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";

import { useLocalSearchParams, router } from "expo-router";
import { useObservationDraftStore } from "@/store/observationDraft";
import { useState , useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

import {
  uploadObservationImage,
  identifyAnimal,
} from "@/api/observations";

export default function UploadScreen() {
 const imageUri = useObservationDraftStore(
  (state) => state.imageUri
);

useEffect(() => {
  console.log("UPLOAD SCREEN IMAGE URI:", imageUri);
}, [imageUri]);

useEffect(() => {
  console.log("UPLOAD SCREEN IMAGE URI:", imageUri);

  if (imageUri) {
    console.log(
      "URI starts with file://:",
      imageUri.startsWith("file://")
    );

    console.log(
      "URI length:",
      imageUri.length
    );
  }
}, [imageUri]);

  const [analyzing, setAnalyzing] = useState(false);
  const [imageError, setImageError] = useState(false);

  const analyzeImage = async () => {
    if (!imageUri) {
      Alert.alert(
        "No Image",
        "No image was selected. Please capture or choose an image first."
      );
      return;
    }

    try {
      setAnalyzing(true);

      // --------------------------------
      // 1. Upload image to Cloudinary
      // --------------------------------

      const uploadResult =
        await uploadObservationImage(imageUri);

      const imageUrl = uploadResult.image.url;

      const cloudinaryPublicId =
        uploadResult.image.publicId;

      console.log(
        "Image uploaded successfully:",
        imageUrl
      );

      // --------------------------------
      // 2. Ask backend AI to identify it
      // --------------------------------

      const aiResponse =
        await identifyAnimal(imageUrl);

      console.log(
        "AI identification result:",
        aiResponse
      );

      const result = aiResponse.result;

      // --------------------------------
      // 3. Check if image contains animal
      // --------------------------------

      if (!result.isAnimal) {
        Alert.alert(
          "No Wildlife Detected",
          "We couldn't identify an animal in this image. Please try another wildlife photo."
        );

        return;
      }

      // --------------------------------
      // 4. Navigate to Result
      // --------------------------------

      router.push({
        pathname: "/observation/result",
        params: {
          species: result.species,
          scientificName: result.scientificName,
          confidence: String(result.confidence),
          imageUrl,
          cloudinaryPublicId,
        },
      });
    } catch (error) {
      console.error(
        "Observation analysis error:",
        error
      );

      Alert.alert(
        "Identification Failed",
        error instanceof Error
          ? error.message
          : "Unable to identify the animal. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={analyzing}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={Colors.text}
          />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.eyebrow}>
            OBSERVATION
          </Text>

          <Text style={styles.headerTitle}>
            Review Photo
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Image */}
      <View style={styles.imageSection}>
        <View style={styles.imageContainer}>
         {imageUri && !imageError ? (
  <Image
    source={{ uri: imageUri }}
    style={styles.image}

    onLoad={() => {
      console.log(
        "Observation image loaded successfully"
      );

      setImageError(false);
    }}
    onError={(error) => {
      console.log(
        "Observation image failed:",
        error
      );

      setImageError(true);
    }}
  />
)  : (
            <View style={styles.imageError}>
              <Ionicons
                name="image-outline"
                size={42}
                color={Colors.textMuted}
              />

              <Text style={styles.imageErrorTitle}>
                Unable to preview image
              </Text>

              <Text style={styles.imageErrorText}>
                Please go back and capture or select
                the photo again.
              </Text>
            </View>
          )}

          {/* Image overlay */}
          {!imageError && (
            <View style={styles.imageOverlay}>
              <View style={styles.imageBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={15}
                  color={Colors.white}
                />

                <Text style={styles.imageBadgeText}>
                  PHOTO READY
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        <Text style={styles.title}>
          Ready to identify?
        </Text>

        <Text style={styles.description}>
          Our wildlife AI will analyze your photo
          and identify the species.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.analyzeButton,
            analyzing && styles.disabled,
            pressed && !analyzing && styles.pressed,
          ]}
          onPress={analyzeImage}
          disabled={analyzing || !imageUri}
        >
          {analyzing ? (
            <>
              <ActivityIndicator
                size="small"
                color={Colors.white}
              />

              <Text style={styles.buttonText}>
                Analyzing Wildlife...
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name="sparkles-outline"
                size={20}
                color={Colors.white}
              />

              <Text style={styles.buttonText}>
                Analyze Wildlife
              </Text>
            </>
          )}
        </Pressable>

        <Text style={styles.secureText}>
          <Ionicons
            name="shield-checkmark-outline"
            size={13}
            color={Colors.textMuted}
          />{" "}
          Your photo is securely processed
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
    height: 104,
    paddingHorizontal: Spacing.screen,
    paddingTop: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.small,
  },

  headerCenter: {
    alignItems: "center",
  },

  eyebrow: {
    color: Colors.textMuted,
    ...Typography.label,
  },

  headerTitle: {
    color: Colors.text,
    ...Typography.h3,
    marginTop: 2,
  },

  headerSpacer: {
    width: 40,
  },

  imageSection: {
    flex: 1,
    paddingHorizontal: Spacing.screen,
  },

  imageContainer: {
    flex: 1,
    borderRadius: Radius.xl,
    overflow: "hidden",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.medium,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imageOverlay: {
    position: "absolute",
    left: Spacing.md,
    top: Spacing.md,
  },

  imageBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.68)",
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },

  imageBadgeText: {
    color: Colors.white,
    ...Typography.label,
    fontSize: 10,
  },

  imageError: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xxxl,
  },

  imageErrorTitle: {
    color: Colors.text,
    ...Typography.h3,
    marginTop: Spacing.lg,
  },

  imageErrorText: {
    color: Colors.textSecondary,
    ...Typography.body,
    textAlign: "center",
    marginTop: Spacing.sm,
  },

  bottom: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
    paddingBottom: 28,
  },

  title: {
    color: Colors.text,
    ...Typography.h2,
  },

  description: {
    color: Colors.textSecondary,
    ...Typography.body,
    marginTop: Spacing.sm,
  },

  analyzeButton: {
    marginTop: Spacing.xl,
    minHeight: 56,
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
  },

  disabled: {
    opacity: 0.65,
  },

  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },

  buttonText: {
    color: Colors.white,
    ...Typography.button,
  },

  secureText: {
    color: Colors.textMuted,
    ...Typography.caption,
    textAlign: "center",
    marginTop: Spacing.md,
  },
});