import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";

interface GreetingProps {
  name: string;
}

export default function Greeting({
  name,
}: GreetingProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>
        WELCOME BACK
      </Text>

      <Text style={styles.title}>
        Hello, {name}
      </Text>

      <Text style={styles.subtitle}>
        Ready to discover something wild?
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },

  eyebrow: {
    color: Colors.textSecondary,
    ...Typography.label,
  },

  title: {
    color: Colors.text,
    ...Typography.h1,
    marginTop: Spacing.xs,
  },

  subtitle: {
    color: Colors.textSecondary,
    ...Typography.body,
    marginTop: Spacing.sm,
  },
});