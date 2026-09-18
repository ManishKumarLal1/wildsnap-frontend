import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { router } from "expo-router";

import Greeting from "@/components/home/Greeting";
import StreakCard from "@/components/home/StreakCard";
import XPCard from "@/components/home/XPCard";
import RecentDiscoveries from "@/components/home/RecentDiscoveries";
import CaptureButton from "@/components/home/CaptureButton";
import HomeHeader from "@/components/home/HomeHeader";

import { Colors } from "@/theme/colors";
import { useUserStore } from "@/store/userStore";

export default function HomeScreen() {
  const {
    user,
    collection,
    observations,
  } = useUserStore();

  /*
   * Temporary MVP level system.
   *
   * We'll move this into utils/xp.ts
   * later.
   */
  const XP_PER_LEVEL = 1000;

  const level =
    Math.floor(user.xp / XP_PER_LEVEL) + 1;

    const nextLevelXp = level * XP_PER_LEVEL;


  /*
   * Convert observations into the
   * format expected by RecentDiscoveries.
   *
   * Most recent observations first.
   */
  const discoveries = observations
    .slice()
    .reverse()
    .slice(0, 3)
    .map((observation) => ({
      id: observation.id,
      name: observation.speciesName,
      rarity: observation.rarity,
      emoji:
        collection.find(
          (species) =>
            species.id ===
            observation.speciesId
        )?.emoji ?? "🐾",
    }));


  return (
    <View style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Greeting */}

        <Greeting
          name={user.username}
        />


        {/* Streak */}

        <StreakCard
          streak={user.streak}
        />


        {/* XP */}

        <XPCard
          level={level}
          xp={user.xp}
          nextLevelXp={nextLevelXp}
        />


      

        


        {/* Recent Discoveries */}

        <RecentDiscoveries
          discoveries={discoveries}
        />


        {/* Camera */}

        <CaptureButton
          onPress={() =>
            router.push("/camera")
          }
        />

      </ScrollView>

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
});