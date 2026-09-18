import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";

import { useObservationDraftStore } from "@/store/observationDraft";

import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

export default function CameraScreen() {
  const [permission, requestPermission] =
    useCameraPermissions();

    const setImageUri = useObservationDraftStore(
  (state) => state.setImageUri
);

  const cameraRef = useRef<CameraView>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const takePhoto = async () => {
    if (!cameraRef.current || !cameraReady) {
      return;
    }

    try {
      const photo =
        await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });

     if (photo?.uri) {
  console.log("Captured image URI:", photo.uri);

  setImageUri(photo.uri);

  router.push("/observation/upload");
}
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to take photo."
      );
      console.error(error);
    }
  };

  const pickImage = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

    if (
      !result.canceled &&
      result.assets.length > 0
    ) {
    const uri = result.assets[0].uri;

console.log("Selected gallery image:", uri);

setImageUri(uri);

router.push("/observation/upload");
    }
  };

  /*
   * Permission Loading
   */
  if (!permission) {
    return (
      <View style={styles.container} />
    );
  }

  /*
   * Permission Screen
   */
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIcon}>
            <Ionicons
              name="camera-outline"
              size={38}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.permissionTitle}>
            Camera Access Required
          </Text>

          <Text style={styles.permissionText}>
            WildSnap needs access to your camera
            so you can capture wildlife
            observations.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.permissionButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={requestPermission}
          >
            <Ionicons
              name="camera-outline"
              size={19}
              color={Colors.white}
            />

            <Text
              style={styles.permissionButtonText}
            >
              Allow Camera
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  /*
   * Camera Screen
   */
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        onCameraReady={() =>
          setCameraReady(true)
        }
      />

      {/* Dark overlays */}
      <View
        pointerEvents="none"
        style={styles.topGradient}
      />

      <View
        pointerEvents="none"
        style={styles.bottomGradient}
      />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.titleContainer}>
          <View style={styles.titleIcon}>
            <Ionicons
              name="leaf"
              size={15}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.title}>
            Capture Wildlife
          </Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.controlPressed,
          ]}
          hitSlop={8}
        >
          <Ionicons
            name="close"
            size={25}
            color={Colors.white}
          />
        </Pressable>
      </View>

      {/* Camera Guide */}
      <View style={styles.guideContainer}>
        <View style={styles.cornerTopLeft} />
        <View style={styles.cornerTopRight} />
        <View style={styles.cornerBottomLeft} />
        <View style={styles.cornerBottomRight} />

        <View style={styles.guideLabel}>
          <Ionicons
            name="scan-outline"
            size={15}
            color={Colors.white}
          />

          <Text style={styles.guideText}>
            Place the animal inside the frame
          </Text>
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomContainer}>
        {/* Gallery */}
        <Pressable
          style={({ pressed }) => [
            styles.galleryButton,
            pressed && styles.controlPressed,
          ]}
          onPress={pickImage}
        >
          <View style={styles.galleryIconContainer}>
            <Ionicons
              name="images-outline"
              size={25}
              color={Colors.white}
            />
          </View>

          <Text style={styles.controlText}>
            Gallery
          </Text>
        </Pressable>

        {/* Capture */}
        <Pressable
          style={({ pressed }) => [
            styles.captureButton,
            pressed &&
              styles.captureButtonPressed,
          ]}
          onPress={takePhoto}
          disabled={!cameraReady}
        >
          <View style={styles.captureInner} />
        </Pressable>

        {/* Balance Placeholder */}
        <View style={styles.placeholder} />
      </View>

      {/* Camera Loading */}
      {!cameraReady && (
        <View style={styles.cameraLoading}>
          <Text style={styles.cameraLoadingText}>
            Starting camera...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  /*
   * Permission
   */

  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.screen,
  },

  permissionCard: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.card,
    padding: Spacing.cardLarge,
    alignItems: "center",
    ...Shadows.small,
  },

  permissionIcon: {
    width: 78,
    height: 78,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },

  permissionTitle: {
    color: Colors.text,
    ...Typography.h3,
    textAlign: "center",
  },

  permissionText: {
    color: Colors.textSecondary,
    ...Typography.body,
    textAlign: "center",
    lineHeight: 22,
    marginTop: Spacing.sm,
    maxWidth: 340,
  },

  permissionButton: {
    minHeight: 54,
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    ...Shadows.small,
  },

  permissionButtonText: {
    color: Colors.white,
    ...Typography.button,
  },

  /*
   * Camera Top Bar
   */

  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 210,
    backgroundColor: "rgba(0,0,0,0.38)",
  },

  topBar: {
    position: "absolute",
    top: 52,
    left: Spacing.screen,
    right: Spacing.screen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  titleIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: Colors.white,
    ...Typography.h3,
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  /*
   * Camera Guide
   */

  guideContainer: {
    position: "absolute",
    width: "76%",
    height: "45%",
    alignSelf: "center",
    top: "24%",
  },

  cornerTopLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 38,
    height: 38,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: Colors.white,
    borderTopLeftRadius: Radius.sm,
  },

  cornerTopRight: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 38,
    height: 38,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: Colors.white,
    borderTopRightRadius: Radius.sm,
  },

  cornerBottomLeft: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: 38,
    height: 38,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: Colors.white,
    borderBottomLeftRadius: Radius.sm,
  },

  cornerBottomRight: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 38,
    height: 38,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: Colors.white,
    borderBottomRightRadius: Radius.sm,
  },

  guideLabel: {
    position: "absolute",
    bottom: -48,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },

  guideText: {
    color: Colors.white,
    ...Typography.caption,
  },

  /*
   * Bottom Controls
   */

  bottomContainer: {
    position: "absolute",
    bottom: 42,
    left: Spacing.screen,
    right: Spacing.screen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  galleryButton: {
    width: 72,
    alignItems: "center",
    justifyContent: "center",
  },

  galleryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(0,0,0,0.38)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  controlText: {
    color: Colors.white,
    ...Typography.captionMedium,
    marginTop: Spacing.xs,
  },

  captureButton: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.small,
  },

  captureInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#000000",
  },

  captureButtonPressed: {
    transform: [{ scale: 0.94 }],
  },

  controlPressed: {
    opacity: 0.7,
  },

  placeholder: {
    width: 72,
  },

  /*
   * Camera Loading
   */

  cameraLoading: {
    position: "absolute",
    alignSelf: "center",
    top: "48%",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },

  cameraLoadingText: {
    color: Colors.white,
    ...Typography.captionMedium,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});