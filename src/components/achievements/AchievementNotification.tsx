import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

import { Colors } from "@/theme/colors";
import {
  AchievementNotification as AchievementNotificationType,
} from "@/store/userStore";

interface Props {
  notification: AchievementNotificationType;
  onDismiss: () => void;
}

export default function AchievementNotification({
  notification,
  onDismiss,
}: Props) {
  return (
    <Pressable
      style={styles.container}
      onPress={onDismiss}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          {notification.icon}
        </Text>
      </View>

      <View style={styles.content}>

        <Text style={styles.label}>
          ACHIEVEMENT UNLOCKED
        </Text>

        <Text style={styles.title}>
          {notification.title}
        </Text>

        <Text style={styles.description}>
          {notification.description}
        </Text>

        <Text style={styles.reward}>
          +{notification.rewardXP} XP
        </Text>

      </View>

      <Text style={styles.close}>
        ×
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    top: 55,
    left: 15,
    right: 15,

    backgroundColor: Colors.surface,

    borderRadius: 18,

    padding: 14,

    flexDirection: "row",

    alignItems: "center",

    elevation: 8,

    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    zIndex: 999,
  },

  iconContainer: {
    width: 58,
    height: 58,

    borderRadius: 16,

    backgroundColor: Colors.background,

    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 30,
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  label: {
    color: Colors.primary,

    fontSize: 10,

    fontWeight: "900",

    letterSpacing: 1,
  },

  title: {
    color: Colors.text,

    fontSize: 17,

    fontWeight: "800",

    marginTop: 3,
  },

  description: {
    color: Colors.textSecondary,

    fontSize: 11,

    marginTop: 2,
  },

  reward: {
    color: Colors.success,

    fontSize: 12,

    fontWeight: "800",

    marginTop: 5,
  },

  close: {
    color: Colors.textSecondary,

    fontSize: 24,

    marginLeft: 8,
  },
});