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

import { useAuth } from "@/context/AuthContext";

export default function RegisterScreen() {
  const { register: registerUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  // Password requirements
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9\s]/.test(password),
    noSpaces: !/\s/.test(password),
  };

  const passwordValid =
    Object.values(passwordRequirements).every(Boolean);

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const isFormValid =
    username.trim().length >= 3 &&
    passwordValid &&
    passwordsMatch;

  const handleRegister = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      Toast.error(
        "Username Required",
        "Please enter a username."
      );
      return;
    }

    if (trimmedUsername.length < 3) {
      Toast.error(
        "Invalid Username",
        "Username must be at least 3 characters long."
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

    if (password !== confirmPassword) {
      Toast.error(
        "Passwords Don't Match",
        "Please make sure both passwords are the same."
      );
      return;
    }

    try {
      setLoading(true);

      await registerUser(
        trimmedUsername,
        password
      );

      Toast.success(
        "Account Created 🎉",
        "Welcome to WildSnap!"
      );

      // AuthContext has already saved the token
      // and updated the authenticated user state.
      // The auth/layout flow can now take the user
      // into the app.

    } catch (error: any) {
      console.error(
        "Registration error:",
        error?.response?.data || error?.message
      );

      const responseData = error?.response?.data;

      if (responseData?.errors) {
        Toast.error(
          "Invalid Password",
          responseData.errors[0]
        );
      } else {
        Toast.error(
          "Registration Failed",
          responseData?.message ||
            "Unable to create your account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const renderRequirement = (
    valid: boolean,
    text: string
  ) => {
    return (
      <View
        style={styles.requirementRow}
        key={text}
      >
        <View
          style={[
            styles.requirementIcon,
            valid &&
              styles.requirementIconValid,
          ]}
        >
          <Ionicons
            name={
              valid
                ? "checkmark"
                : "ellipse-outline"
            }
            size={14}
            color={
              valid
                ? Colors.primary
                : Colors.textMuted
            }
          />
        </View>

        <Text
          style={[
            styles.requirementText,
            valid &&
              styles.requirementTextValid,
          ]}
        >
          {text}
        </Text>
      </View>
    );
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
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
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
              Create Account
            </Text>

            <Text style={styles.subtitle}>
              Start your wildlife journey
            </Text>
          </View>

          {/* Username */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Username
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={19}
                color={Colors.textMuted}
              />

              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Choose a username"
                placeholderTextColor={
                  Colors.textMuted
                }
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                maxLength={30}
              />
            </View>

            {username.length > 0 &&
              username.length < 3 && (
                <Text style={styles.inputError}>
                  Username must be at least 3 characters
                </Text>
              )}
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
                placeholder="Create a password"
                placeholderTextColor={
                  Colors.textMuted
                }
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

            {/* Password Requirements */}
            <View style={styles.requirements}>
              <View
                style={styles.requirementsHeader}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={17}
                  color={Colors.textSecondary}
                />

                <Text
                  style={
                    styles.requirementsTitle
                  }
                >
                  Password requirements
                </Text>
              </View>

              {renderRequirement(
                passwordRequirements.length,
                "At least 8 characters"
              )}

              {renderRequirement(
                passwordRequirements.uppercase,
                "One uppercase letter"
              )}

              {renderRequirement(
                passwordRequirements.lowercase,
                "One lowercase letter"
              )}

              {renderRequirement(
                passwordRequirements.number,
                "One number"
              )}

              {renderRequirement(
                passwordRequirements.special,
                "One special character"
              )}

              {renderRequirement(
                passwordRequirements.noSpaces,
                "No spaces"
              )}
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
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor={
                  Colors.textMuted
                }
                secureTextEntry={
                  !showConfirmPassword
                }
                autoCapitalize="none"
                autoCorrect={false}
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
                  size={15}
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

          {/* Register Button */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              (!isFormValid || loading) &&
                styles.buttonDisabled,
              pressed &&
                isFormValid &&
                !loading &&
                styles.buttonPressed,
            ]}
            onPress={handleRegister}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator
                color={Colors.white}
              />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  Create Account
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={19}
                  color={Colors.white}
                />
              </>
            )}
          </Pressable>

          {/* Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <Pressable
              onPress={() =>
                router.replace(
                  "/(auth)/login"
                )
              }
            >
              <Text style={styles.loginLink}>
                Login
              </Text>
            </Pressable>
          </View>
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
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxxl,
  },

  content: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    paddingHorizontal: Spacing.screen,
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
    marginBottom: Spacing.sm,
  },

  requirementsTitle: {
    color: Colors.text,
    ...Typography.captionMedium,
  },

  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xs,
  },

  requirementIcon: {
    width: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  requirementIconValid: {
    // Kept for consistency with the requirement state.
  },

  requirementText: {
    color: Colors.textMuted,
    ...Typography.caption,
    marginLeft: Spacing.xs,
  },

  requirementTextValid: {
    color: Colors.primary,
  },

  inputError: {
    color: "#DC2626",
    ...Typography.caption,
    marginTop: Spacing.xs,
  },

  passwordStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
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

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xxl,
    gap: Spacing.xs,
  },

  loginText: {
    color: Colors.textSecondary,
    ...Typography.body,
  },

  loginLink: {
    color: Colors.primary,
    ...Typography.bodyMedium,
  },
});
