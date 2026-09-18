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

import { useState, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Toast } from "@/utils/toast";

import { Colors } from "@/theme/colors";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

import { resetPassword } from "@/api/auth";

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const confirmRef = useRef<TextInput>(null);

  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_\-[\]~`+=;'/]/.test(password),
    noSpaces: !/\s/.test(password),
  };

  const passwordValid =
    Object.values(passwordRequirements).every(Boolean);

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handleResetPassword = async () => {
    if (!token) {
      Toast.error(
        "Invalid Reset Link",
        "This link is invalid."
      );
      return;
    }

    if (!passwordValid) {
      Toast.error(
        "Weak Password",
        "Please meet all password requirements."
      );
      return;
    }

    if (!passwordsMatch) {
      Toast.error(
        "Passwords Don't Match",
        "Please make sure both passwords are the same."
      );
      return;
    }

    try {
      setLoading(true);

      await resetPassword(token, password);

      setSuccess(true);

      Toast.success(
        "Password Reset 🎉",
        "Your password has been changed successfully."
      );
    } catch (error: any) {
      console.error(
        "Reset password error:",
        error?.response?.data || error?.message
      );

      const responseData = error?.response?.data;

      Toast.error(
        "Password Reset Failed",
        responseData?.errors?.[0] ||
          responseData?.message ||
          "Unable to reset your password."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderRequirement = (
    valid: boolean,
    text: string
  ) => (
    <View style={styles.requirementRow} key={text}>
      <Ionicons
        name={
          valid
            ? "checkmark-circle"
            : "ellipse-outline"
        }
        size={16}
        color={
          valid
            ? Colors.primary
            : Colors.textMuted
        }
      />

      <Text
        style={[
          styles.requirementText,
          valid && styles.requirementTextValid,
        ]}
      >
        {text}
      </Text>
    </View>
  );

  /*
   * Success State
   */
  if (success) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.successScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.successCard}>
              <View style={styles.successIconContainer}>
                <Ionicons
                  name="checkmark-circle"
                  size={46}
                  color={Colors.primary}
                />
              </View>

              <Text style={styles.successTitle}>
                Password Reset!
              </Text>

              <Text style={styles.successMessage}>
                Your password has been successfully changed.
                You can now log in with your new password.
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() =>
                  router.replace("/(auth)/login")
                }
              >
                <Text style={styles.buttonText}>
                  Login
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color={Colors.white}
                />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  /*
   * Form State
   */
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
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={32}
                color={Colors.primary}
              />
            </View>

            <Text style={styles.title}>
              Reset Password
            </Text>

            <Text style={styles.subtitle}>
              Create a new password for your account.
            </Text>
          </View>

          {/* New Password */}
          <View style={styles.field}>
            <Text style={styles.label}>
              New Password
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
                placeholder="Enter new password"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() =>
                  confirmRef.current?.focus()
                }
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

            {/* Password Requirements */}
            <View style={styles.requirements}>
              <View style={styles.requirementsHeader}>
                <View style={styles.requirementsIcon}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={17}
                    color={Colors.primary}
                  />
                </View>

                <Text style={styles.requirementsTitle}>
                  Password requirements
                </Text>
              </View>

              <View style={styles.requirementsGrid}>
                {renderRequirement(
                  passwordRequirements.length,
                  "8+ characters"
                )}

                {renderRequirement(
                  passwordRequirements.uppercase,
                  "Uppercase letter"
                )}

                {renderRequirement(
                  passwordRequirements.lowercase,
                  "Lowercase letter"
                )}

                {renderRequirement(
                  passwordRequirements.number,
                  "Number"
                )}

                {renderRequirement(
                  passwordRequirements.special,
                  "Special character"
                )}

                {renderRequirement(
                  passwordRequirements.noSpaces,
                  "No spaces"
                )}
              </View>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Confirm Password
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color={Colors.textMuted}
              />

              <TextInput
                ref={confirmRef}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleResetPassword}
                style={styles.input}
              />

              <Pressable
                onPress={() =>
                  setShowConfirmPassword(
                    (previous) => !previous
                  )
                }
                hitSlop={10}
              >
                <Ionicons
                  name={
                    showConfirmPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={20}
                  color={Colors.textSecondary}
                />
              </Pressable>
            </View>

            {confirmPassword.length > 0 && (
              <View style={styles.passwordStatus}>
                <Ionicons
                  name={
                    passwordsMatch
                      ? "checkmark-circle"
                      : "alert-circle"
                  }
                  size={16}
                  color={
                    passwordsMatch
                      ? Colors.primary
                      : "#DC2626"
                  }
                />

                <Text
                  style={
                    passwordsMatch
                      ? styles.matchSuccess
                      : styles.inputError
                  }
                >
                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"}
                </Text>
              </View>
            )}
          </View>

          {/* Reset Button */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              (loading ||
                !passwordValid ||
                !passwordsMatch) &&
                styles.buttonDisabled,
              pressed &&
                !loading &&
                passwordValid &&
                passwordsMatch &&
                styles.buttonPressed,
            ]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                color={Colors.white}
              />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  Reset Password
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color={Colors.white}
                />
              </>
            )}
          </Pressable>

          {/* Back */}
          <Pressable
            onPress={() =>
              router.replace("/(auth)/login")
            }
            style={styles.backToLoginContainer}
          >
            <Ionicons
              name="arrow-back"
              size={17}
              color={Colors.primary}
            />

            <Text style={styles.backToLogin}>
              Back to Login
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

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: Spacing.xxxl,
  },

  successScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: Spacing.xxxl,
  },

  content: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    paddingHorizontal: Spacing.screen,
  },

  header: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },

  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
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
    lineHeight: 22,
    maxWidth: 360,
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

  requirements: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.card,
    marginTop: Spacing.md,
    ...Shadows.small,
  },

  requirementsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  requirementsIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },

  requirementsTitle: {
    color: Colors.text,
    ...Typography.captionMedium,
  },

  requirementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },

  requirementRow: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
  },

  requirementText: {
    color: Colors.textMuted,
    ...Typography.caption,
    marginLeft: Spacing.xs,
    flexShrink: 1,
  },

  requirementTextValid: {
    color: Colors.primary,
  },

  passwordStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },

  inputError: {
    color: "#DC2626",
    ...Typography.caption,
  },

  matchSuccess: {
    color: Colors.primary,
    ...Typography.caption,
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
    marginTop: Spacing.sm,
    ...Shadows.small,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: Colors.white,
    ...Typography.button,
  },

  backToLoginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xxl,
  },

  backToLogin: {
    color: Colors.primary,
    ...Typography.bodyMedium,
  },

  /* Success State */

  successCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.cardLarge,
    alignItems: "center",
    ...Shadows.small,
  },

  successIconContainer: {
    width: 84,
    height: 84,
    borderRadius: Radius.xl,
    backgroundColor: Colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },

  successTitle: {
    color: Colors.text,
    ...Typography.h3,
    textAlign: "center",
  },

  successMessage: {
    color: Colors.textSecondary,
    ...Typography.body,
    lineHeight: 23,
    textAlign: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    maxWidth: 380,
  },
});