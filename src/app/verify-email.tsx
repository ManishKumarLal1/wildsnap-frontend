import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { Toast } from "@/utils/toast";

import api from "@/api/client";
import { Colors } from "@/theme/colors";

export default function VerifyEmailScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      if (!token) {
        setMessage("Verification token is missing.");
        setSuccess(false);
        return;
      }

      const response = await api.get("/auth/verify-email", {
        params: { token },
      });

      setSuccess(true);
      setMessage(
        response.data?.message ||
          "Your email has been verified successfully."
      );

      Toast.success(
  "Email Verified",
  "You can login now."
);
    } catch (error: any) {
      console.error(
        "Email verification error:",
        error?.response?.data || error?.message
      );

      setSuccess(false);

      setMessage(
        error?.response?.data?.message ||
          "This verification link is invalid or has expired."
      );

      Toast.error(
  "Verification Failed",
  error?.response?.data?.message ||
    "This verification link is invalid or has expired."
);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.replace("/(auth)/login");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />

          <Text style={styles.title}>
            Verifying your email...
          </Text>

          <Text style={styles.subtitle}>
            Please wait while we verify your account.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            success
              ? styles.successIconContainer
              : styles.errorIconContainer,
          ]}
        >
          <Text style={styles.icon}>
            {success ? "✓" : "✕"}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          {success
            ? "Email Verified!"
            : "Verification Failed"}
        </Text>

        {/* Message */}
        <Text style={styles.message}>
          {message}
        </Text>

        {success ? (
          <>
            <Text style={styles.loginPrompt}>
              Your account is now verified.
            </Text>

            <Text style={styles.loginPrompt}>
              You can login now.
            </Text>

            <Pressable
              style={styles.button}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>
                Login
              </Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            style={styles.button}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>
              Go to Login
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  card: {
    width: "100%",
    maxWidth: 500,
    alignItems: "center",
    padding: 28,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  successIconContainer: {
    backgroundColor: "#DCFCE7",
  },

  errorIconContainer: {
    backgroundColor: "#FEE2E2",
  },

  icon: {
    fontSize: 42,
    fontWeight: "700",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 12,
  },

  message: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 14,
  },

  loginPrompt: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 6,
  },

  button: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 26,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});