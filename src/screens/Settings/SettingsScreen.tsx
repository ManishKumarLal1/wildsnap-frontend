import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert
} from "react-native";

import { useAuth } from "@/context/AuthContext";

import { useState } from "react";

import { Colors } from "@/theme/colors";

export default function SettingsScreen() {
  const [notifications, setNotifications] =
    useState(true);
    const { logout } = useAuth();

  const [location, setLocation] =
    useState(true);

    const handleLogout = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]
  );
};

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>
        Settings
      </Text>

      <Text style={styles.subtitle}>
        Manage your wildlife explorer experience
      </Text>

      <Text style={styles.section}>
        Preferences
      </Text>

      <SettingRow
        title="Notifications"
        description="Daily reminders and discoveries"
        right={
          <Switch
            value={notifications}
            onValueChange={setNotifications}
          />
        }
      />

      <SettingRow
        title="Location"
        description="Use location for local wildlife"
        right={
          <Switch
            value={location}
            onValueChange={setLocation}
          />
        }
      />

      <Text style={styles.section}>
        Account
      </Text>

      <SettingRow
        title="Edit Profile"
        right={<Text style={styles.arrow}>›</Text>}
      />

      <SettingRow
        title="Privacy"
        right={<Text style={styles.arrow}>›</Text>}
      />

      <SettingRow
        title="About Wildlife"
        right={<Text style={styles.arrow}>›</Text>}
      />

      <Text style={styles.section}>
        Support
      </Text>

      <SettingRow
        title="Help & Support"
        right={<Text style={styles.arrow}>›</Text>}
      />

      <SettingRow
        title="Report a Problem"
        right={<Text style={styles.arrow}>›</Text>}
      />

      <Pressable
  style={styles.logout}
  onPress={handleLogout}
>
  <Text style={styles.logoutText}>
    Logout
  </Text>
</Pressable>

      <Text style={styles.version}>
        Wildlife v1.0.0
      </Text>
    </ScrollView>
  );
}

function SettingRow({
  title,
  description,
  right,
}: {
  title: string;
  description?: string;
  right: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle}>
          {title}
        </Text>

        {description && (
          <Text style={styles.description}>
            {description}
          </Text>
        )}
      </View>

      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },

  title: {
    color: Colors.text,
    fontSize: 30,
    fontWeight: "800",
  },

  subtitle: {
    color: Colors.textSecondary,
    marginTop: 5,
  },

  section: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "800",
    marginTop: 30,
    marginBottom: 10,
  },

  row: {
    backgroundColor: Colors.surface,
    padding: 17,
    borderRadius: 15,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowInfo: {
    flex: 1,
  },

  rowTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
  },

  description: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  arrow: {
    color: Colors.textSecondary,
    fontSize: 25,
  },

  logout: {
    borderWidth: 1,
    borderColor: "#E74C3C",
    borderRadius: 15,
    padding: 16,
    alignItems: "center",
    marginTop: 30,
  },

  logoutText: {
    color: "#E74C3C",
    fontWeight: "800",
  },

  version: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 25,
  },
});