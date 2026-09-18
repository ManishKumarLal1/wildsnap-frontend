import {
  View,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";

import { Colors } from "@/theme/colors";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";

export default function HomeHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/WildSnap_2.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Pressable
        onPress={() => router.push("/(tabs)/profile")}
        style={({ pressed }) => [
          styles.profileButton,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.profileDot} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  alignItems: "flex-start",
  },

  logo: {
  width: 180,
  height: 48,
  marginLeft: -12,
  marginTop: 12,
},

  profileButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  profileDot: {
    width: 12,
    height: 12,
    borderRadius: Radius.pill,
    backgroundColor: Colors.text,
  },

  pressed: {
    opacity: 0.6,
  },
});