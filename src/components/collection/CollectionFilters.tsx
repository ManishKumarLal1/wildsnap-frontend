import {
  ScrollView,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";

const filters = [
  "All",
  "Bird",
  "Mammal",
  "Reptile",
  "Amphibian",
  "Insect",
  "Fish",
];

interface Props {
  selected: string;
  onSelect: (filter: string) => void;
}

export default function CollectionFilters({
  selected,
  onSelect,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {filters.map((filter) => {
        const active = selected === filter;

        return (
          <Pressable
            key={filter}
            onPress={() => onSelect(filter)}
            style={({ pressed }) => [
              styles.filter,
              active && styles.activeFilter,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.text,
                active && styles.activeText,
              ]}
            >
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.xl,
  },

  content: {
    paddingRight: Spacing.screen,
    gap: Spacing.sm,
  },

  filter: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radius.pill,

    borderWidth: 1,
    borderColor: Colors.border,
  },

  activeFilter: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },

  text: {
    color: Colors.textSecondary,
    ...Typography.captionMedium,
  },

  activeText: {
    color: Colors.white,
  },
});