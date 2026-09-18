import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Toast } from "@/utils/toast";
import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";
import { forgotPassword } from "@/api/auth";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      Toast.error("Email Required", "Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const result = await forgotPassword(trimmedEmail);
      setSent(true);
      Toast.success(
        "Reset Email Sent",
        result?.message || "Check your email for a password reset link."
      );
    } catch (error: any) {
      console.error(
        "Forgot password error:",
        error?.response?.data || error?.message
      );
      Toast.error(
        "Request Failed",
        error?.response?.data?.message ||
          "Unable to send the reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Success State UI
  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Ionicons name="mail-outline" size={32} color={Colors.primary} />
          </View>

          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a password reset link to:
          </Text>

          <Text style={styles.email}>{email.trim()}</Text>
          <Text style={styles.subtitle}>
            The link will expire in 15 minutes.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text style={styles.buttonText}>Back to Login</Text>
          </Pressable>

          <Pressable
            onPress={() => setSent(false)}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Try another email</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Form State UI
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="lock-closed-outline" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email and we'll send you a password reset link.
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={19} color={Colors.textMuted} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={Colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              loading && styles.buttonDisabled,
              pressed && !loading && styles.buttonPressed,
            ]}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Text style={styles.buttonText}>Send Reset Link</Text>
                <Ionicons name="arrow-forward" size={19} color={Colors.white} />
              </>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.replace("/(auth)/login")}
            style={styles.backToLoginContainer}
          >
            <Text style={styles.backToLogin}>← Back to Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1, justifyContent: "center", paddingVertical: Spacing.xxxl },
  content: { width: "100%", maxWidth: 500, alignSelf: "center", paddingHorizontal: Spacing.screen },
  header: { alignItems: "center", marginBottom: Spacing.xxxl },
  logoContainer: {
    width: 72, height: 72, borderRadius: Radius.xl, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border, alignItems: "center", justifyContent: "center",
    marginBottom: Spacing.xl, ...Shadows.small,
  },
  title: { color: Colors.text, ...Typography.display, textAlign: "center" },
  subtitle: { color: Colors.textSecondary, ...Typography.body, textAlign: "center", marginTop: Spacing.sm, lineHeight: 22 },
  email: { color: Colors.primary, ...Typography.bodyMedium, textAlign: "center", marginTop: Spacing.sm, fontSize: 16 },
  field: { marginBottom: Spacing.lg },
  label: { color: Colors.text, ...Typography.label, marginBottom: Spacing.sm },
  inputContainer: {
    minHeight: 54, flexDirection: "row", alignItems: "center", gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1,
    borderColor: Colors.border, paddingHorizontal: Spacing.md, ...Shadows.small,
  },
  input: { flex: 1, color: Colors.text, ...Typography.body, paddingVertical: Spacing.md },
  button: {
    minHeight: 54, backgroundColor: Colors.primary, borderRadius: Radius.button,
    alignItems: "center", justifyContent: "center", flexDirection: "row",
    gap: Spacing.sm, paddingHorizontal: Spacing.xl, marginTop: Spacing.sm, ...Shadows.small,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  buttonText: { color: Colors.white, ...Typography.button },
  backToLoginContainer: { alignItems: "center", marginTop: Spacing.xxl },
  backToLogin: { color: Colors.primary, ...Typography.bodyMedium },
  secondaryButton: { alignItems: "center", marginTop: Spacing.xl },
  secondaryButtonText: { color: Colors.primary, ...Typography.bodyMedium },
});