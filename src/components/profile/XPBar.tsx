import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";

interface Props {
  currentXP: number;
  requiredXP: number;
}

export default function XPBar({
  currentXP,
  requiredXP,
}: Props) {
  const progress =
    requiredXP > 0
      ? Math.min(currentXP / requiredXP, 1)
      : 0;

  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <Text style={styles.xp}>
          {currentXP.toLocaleString()} XP
        </Text>

        <Text style={styles.required}>
          {requiredXP.toLocaleString()} XP
        </Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.progress,
            {
              width: `${progress * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },

  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },

  xp: {
    color: Colors.text,
    ...Typography.bodyMedium,
  },

  required: {
    color: Colors.textMuted,
    ...Typography.caption,
  },

  track: {
    height: 7,
    backgroundColor: Colors.surfaceLight,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
  },
});