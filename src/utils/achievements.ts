import { Achievement } from "@/types/Achievement";
import { Observation } from "@/types/Observation";
import { Species } from "@/types/Species";
import { User } from "@/types/User";

export function getAchievements(
  user: User,
  collection: Species[],
  observations: Observation[]
): Achievement[] {
  const discoveredSpecies = collection.filter(
    (species) => species.discovered
  ).length;

  const birdCount = collection.filter(
    (species) =>
      species.discovered &&
      species.category === "Bird"
  ).length;

  const rareSpeciesCount = collection.filter(
    (species) =>
      species.discovered &&
      (
        species.rarity === "Rare" ||
        species.rarity === "Epic" ||
        species.rarity === "Legendary"
      )
  ).length;

  return [
    {
      id: "first-discovery",
      title: "First Discovery",
      description: "Discover your first species",
      icon: "🌱",
      category: "Discovery",
      target: 1,
      current: discoveredSpecies,
      unlocked: discoveredSpecies >= 1,
      rewardXP: 50,
    },

    {
      id: "explorer",
      title: "Explorer",
      description: "Discover 10 different species",
      icon: "🌿",
      category: "Discovery",
      target: 10,
      current: discoveredSpecies,
      unlocked: discoveredSpecies >= 10,
      rewardXP: 250,
    },

    {
      id: "wildlife-expert",
      title: "Wildlife Expert",
      description: "Discover 50 different species",
      icon: "🧭",
      category: "Explorer",
      target: 50,
      current: discoveredSpecies,
      unlocked: discoveredSpecies >= 50,
      rewardXP: 1000,
    },

    {
      id: "bird-watcher",
      title: "Bird Watcher",
      description: "Discover 5 bird species",
      icon: "🦅",
      category: "Discovery",
      target: 5,
      current: birdCount,
      unlocked: birdCount >= 5,
      rewardXP: 150,
    },

    {
      id: "observer",
      title: "Observer",
      description: "Record 10 observations",
      icon: "📷",
      category: "Observation",
      target: 10,
      current: observations.length,
      unlocked: observations.length >= 10,
      rewardXP: 200,
    },

    {
      id: "photographer",
      title: "Wildlife Photographer",
      description: "Record 50 observations",
      icon: "📸",
      category: "Observation",
      target: 50,
      current: observations.length,
      unlocked: observations.length >= 50,
      rewardXP: 500,
    },

    {
      id: "on-fire",
      title: "On Fire",
      description: "Maintain a 7 day streak",
      icon: "🔥",
      category: "Streak",
      target: 7,
      current: user.streak,
      unlocked: user.streak >= 7,
      rewardXP: 250,
    },

    {
      id: "dedicated-explorer",
      title: "Dedicated Explorer",
      description: "Maintain a 30 day streak",
      icon: "🔥",
      category: "Streak",
      target: 30,
      current: user.streak,
      unlocked: user.streak >= 30,
      rewardXP: 1000,
    },

    {
      id: "rare-hunter",
      title: "Rare Hunter",
      description: "Discover 5 rare or higher species",
      icon: "⭐",
      category: "Rarity",
      target: 5,
      current: rareSpeciesCount,
      unlocked: rareSpeciesCount >= 5,
      rewardXP: 500,
    },
  ];
}