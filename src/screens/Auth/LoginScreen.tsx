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

export default function LoginScreen() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Toast.error(
        "Missing Information",
        "Please enter your username and password."
      );

      return;
    }

    try {
      setLoading(true);

      await login(username.trim(), password);

      console.log("Login successful");
    } catch (error: any) {
      console.error(
        "Login error:",
        error?.response?.data || error?.message
      );

      const message =
        error?.response?.data?.message ||
        "Unable to login. Please try again.";

      Toast.error("Login Failed", message);
    } finally {
      setLoading(false);
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
                placeholder="Enter your username"
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

