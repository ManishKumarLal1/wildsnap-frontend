import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Ionicons } from "@expo/vector-icons";

import {
  addToastListener,
  removeToastListener,
  ToastData,
} from "@/utils/toast";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

export default function AppToast() {
  const [toast, setToast] =
    useState<ToastData | null>(null);

  const translateY =
    useRef(new Animated.Value(-120)).current;

  const opacity =
    useRef(new Animated.Value(0)).current;

  const timerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  useEffect(() => {
    const listener = (data: ToastData) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToast(data);

      translateY.setValue(-120);
      opacity.setValue(0);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 70,
          friction: 10,
        }),

        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      timerRef.current = setTimeout(() => {
        hideToast();
      }, data.duration ?? 3000);
    };

    addToastListener(listener);

    return () => {
      removeToastListener(listener);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 180,
        useNativeDriver: true,
      }),

      Animated.timing(opacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast(null);
    });
  };

  if (!toast) {
    return null;
  }

  const icon =
    toast.type === "success"
      ? "checkmark"
      : toast.type === "error"
      ? "close"
      : toast.type === "warning"
      ? "alert"
      : "information";

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity,
          transform: [
            {
              translateY,
            },
          ],
        },
      ]}
    >
      <Pressable
        onPress={hideToast}
        style={styles.toast}
      >
        <View
          style={[
            styles.iconContainer,
            toast.type === "error" &&
              styles.errorIcon,
            toast.type === "warning" &&
              styles.warningIcon,
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color={Colors.white}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            {toast.title}
          </Text>

          {toast.message && (
            <Text
              style={styles.message}
              numberOfLines={2}
            >
              {toast.message}
            </Text>
          )}
        </View>

        <Ionicons
          name="close"
          size={17}
          color="rgba(255,255,255,0.45)"
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",

    top: 58,
    left: 16,
    right: 16,

    zIndex: 9999,
  },

  toast: {
    minHeight: 68,

    backgroundColor: "#1C1C1C",

    borderRadius: Radius.card,

    paddingHorizontal: 14,
    paddingVertical: 12,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",

    ...Shadows.large,
  },

  iconContainer: {
    width: 38,
    height: 38,

    borderRadius: 12,

    backgroundColor: Colors.success,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  errorIcon: {
    backgroundColor: Colors.danger,
  },

  warningIcon: {
    backgroundColor: Colors.warning,
  },

  content: {
    flex: 1,
    marginRight: 10,
  },

  title: {
    color: Colors.white,
    ...Typography.bodyMedium,
  },

  message: {
    color: "rgba(255,255,255,0.62)",
    ...Typography.caption,

    marginTop: 2,
  },
});