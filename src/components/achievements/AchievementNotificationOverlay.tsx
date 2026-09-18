import {
  View,
  StyleSheet,
} from "react-native";

import { useEffect } from "react";

import {
  useUserStore,
} from "@/store/userStore";

import AchievementNotification from "./AchievementNotification";

export default function AchievementNotificationOverlay() {
  const {
    achievementNotifications,
    removeAchievementNotification,
  } = useUserStore();

  const notification =
    achievementNotifications[0];

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timer = setTimeout(() => {
      removeAchievementNotification(
        notification.id
      );
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [
    notification,
    removeAchievementNotification,
  ]);

  if (!notification) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={styles.overlay}
    >
      <AchievementNotification
        notification={notification}
        onDismiss={() =>
          removeAchievementNotification(
            notification.id
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,

    zIndex: 999,
  },
});