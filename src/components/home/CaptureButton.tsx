import {
  Pressable,
  Text,
  StyleSheet,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

interface Props {
  onPress: () => void;
}

export default function CaptureButton({
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name="camera-outline"
          size={22}
          color={Colors.white}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Capture Wildlife
        </Text>

        <Text style={styles.subtitle}>
          Identify a species from the wild
        </Text>
      </View>

      <Ionicons
        name="arrow-forward"
        size={20}
        color={Colors.white}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.card,
    minHeight: 76,

    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,

    flexDirection: "row",
    alignItems: "center",

    marginTop: Spacing.xl,

    ...Shadows.medium,
  },

  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  iconContainer: {
    width: 44,
    height: 44,

    borderRadius: Radius.md,

    backgroundColor: "rgba(255,255,255,0.12)",

    alignItems: "center",
    justifyContent: "center",

    marginRight: Spacing.md,
  },

  content: {
    flex: 1,
  },

  title: {
    color: Colors.white,
    ...Typography.button,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  subtitle: {
    color: "rgba(255,255,255,0.65)",
    ...Typography.caption,
    marginTop: 3,
  },
});