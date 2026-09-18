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

import { Toast } from "@/utils/toast";

import { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

import { useAuth } from "@/context/AuthContext";
import { resendVerification } from "@/api/auth";

export default function LoginScreen() {
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      Toast.error(
        "Missing Information",
        "Please enter your username/email and password."
      );

      return;
    }

    try {
      setLoading(true);

      await login(identifier.trim(), password);

      setShowResend(false);

      console.log("Login successful");
    } catch (error: any) {
      console.error(
        "Login error:",
        error?.response?.data || error?.message
      );

      const message =
        error?.response?.data?.message ||
        "Unable to login. Please try again.";

      const emailNotVerified =
        error?.response?.status === 403;

      setShowResend(emailNotVerified);

      Toast.error("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!identifier.trim()) {
      Toast.error(
        "Missing Information",
        "Enter your username or email first."
      );

      return;
    }

    try {
      setResendLoading(true);

      const result = await resendVerification(
        identifier.trim()
      );

      Toast.success(
        "Email Sent",
        result?.message ||
          "Verification email has been sent."
      );
    } catch (error: any) {
      console.error(
        "Resend verification error:",
        error?.response?.data || error?.message
      );

      Toast.error(
        "Unable to Send Email",
        error?.response?.data?.message ||
          "Unable to resend the verification email. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons
              name="leaf"
              size={30}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.title}>
            Welcome Back
          </Text>

          <Text style={styles.subtitle}>
            Continue your wildlife journey
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Username / Email */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Username or Email
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={19}
                color={Colors.textMuted}
              />

              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="Enter your username or email"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Password
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color={Colors.textMuted}
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />

              <Pressable
                onPress={() =>
                  setShowPassword(
                    (previous) => !previous
                  )
                }
                hitSlop={10}
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={20}
                  color={Colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          {/* Forgot Password */}
          <Pressable
            style={styles.forgotButton}
            onPress={() =>
              router.push("/forgot-password")
            }
          >
            <Text style={styles.forgot}>
              Forgot Password?
            </Text>
          </Pressable>

          {/* Login */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              loading && styles.buttonDisabled,
              pressed &&
                !loading &&
                styles.buttonPressed,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                color={Colors.white}
              />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  Login
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color={Colors.white}
                />
              </>
            )}
          </Pressable>

          {/* Resend Verification */}
          {showResend && (
            <View style={styles.resendCard}>
              <View style={styles.resendIcon}>
                <Ionicons
                  name="mail-outline"
                  size={19}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.resendContent}>
                <Text style={styles.resendTitle}>
                  Email not verified
                </Text>

                <Text style={styles.resendDescription}>
                  Verify your email to continue.
                </Text>

                <Pressable
                  onPress={handleResendVerification}
                  disabled={resendLoading}
                  style={styles.resendButton}
                >
                  {resendLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.primary}
                    />
                  ) : (
                    <Text style={styles.resend}>
                      Resend verification email
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* Register */}
        <View style={styles.registerSection}>
          <Text style={styles.registerText}>
            Don't have an account?
          </Text>

          <Pressable
            onPress={() =>
              router.push("/register")
            }
          >
            <Text style={styles.register}>
              Create Account
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flexGrow: 1,
    padding: Spacing.screen,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxxl,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: Spacing.xxxl,
  },

  logoContainer: {
    width: 68,
    height: 68,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
    ...Shadows.small,
  },

  title: {
    color: Colors.text,
    ...Typography.display,
    textAlign: "center",
  },

  subtitle: {
    color: Colors.textSecondary,
    ...Typography.body,
    textAlign: "center",
    marginTop: Spacing.sm,
  },

  form: {
    width: "100%",
  },

  field: {
    marginBottom: Spacing.lg,
  },

  label: {
    color: Colors.text,
    ...Typography.label,
    marginBottom: Spacing.sm,
  },

  inputContainer: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    ...Shadows.small,
  },

  input: {
    flex: 1,
    color: Colors.text,
    ...Typography.body,
    paddingVertical: Spacing.md,
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -Spacing.sm,
    marginBottom: Spacing.lg,
  },

  forgot: {
    color: Colors.primary,
    ...Typography.captionMedium,
  },

  button: {
    minHeight: 54,
    backgroundColor: Colors.primary,
    borderRadius: Radius.button,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    ...Shadows.small,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: Colors.white,
    ...Typography.button,
  },

  resendCard: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.card,
    marginTop: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.small,
  },

  resendIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },

  resendContent: {
    flex: 1,
  },

  resendTitle: {
    color: Colors.text,
    ...Typography.bodyMedium,
  },

  resendDescription: {
    color: Colors.textSecondary,
    ...Typography.caption,
    marginTop: Spacing.xs,
  },

  resendButton: {
    alignSelf: "flex-start",
    marginTop: Spacing.sm,
  },

  resend: {
    color: Colors.primary,
    ...Typography.captionMedium,
  },

  registerSection: {
    alignItems: "center",
    marginTop: Spacing.xxxl,
  },

  registerText: {
    color: Colors.textSecondary,
    ...Typography.body,
  },

  register: {
    color: Colors.primary,
    ...Typography.bodyMedium,
    marginTop: Spacing.sm,
  },
});