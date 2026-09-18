import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/theme/colors";

interface Props {
  title: string;
  current: number;
  target: number;
  reward: number;
}

export default function DailyMission({
  title,
  current,
  target,
  reward,
}: Props) {
  const progress = current / target;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Today's Mission</Text>
          <Text style={styles.title}>🦅 {title}</Text>
        </View>

        <Text style={styles.reward}>+{reward} XP</Text>
      </View>

      <View style={styles.bar}>
        <View
          style={[
            styles.progress,
            { width: `${progress * 100}%` },
          ]}
        />
      </View>

      <Text style={styles.count}>
        {current} / {target} discovered
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  heading: {
    color: Colors.textSecondary,
    fontSize: 13,
  },

  title: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 6,
  },

  reward: {
    color: Colors.secondary,
    fontWeight: "700",
  },

  bar: {
    height: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    marginTop: 16,
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    backgroundColor: Colors.secondary,
  },

  count: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
});