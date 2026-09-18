import { Rarity } from "@/types/Species";

export const XP_PER_LEVEL = 1000;

/**
 * Calculate user's level from total XP.
 *
 * 0 - 999       => Level 1
 * 1000 - 1999   => Level 2
 * 2000 - 2999   => Level 3
 */
export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / XP_PER_LEVEL) + 1;
}

/**
 * XP earned inside the current level.
 */
export function calculateLevelXP(totalXP: number): number {
  return totalXP % XP_PER_LEVEL;
}

/**
 * XP required to complete the current level.
 */
export function calculateNextLevelXP(): number {
  return XP_PER_LEVEL;
}

/**
 * Progress from 0 to 1.
 */
export function calculateXPProgress(totalXP: number): number {
  return calculateLevelXP(totalXP) / XP_PER_LEVEL;
}

/**
 * XP remaining before next level.
 */
export function calculateXPToNextLevel(
  totalXP: number
): number {
  return XP_PER_LEVEL - calculateLevelXP(totalXP);
}

/**
 * Bonus XP based on rarity.
 */
export function getRarityBonus(
  rarity: Rarity
): number {
  switch (rarity) {
    case "Common":
      return 0;

    case "Uncommon":
      return 25;

    case "Rare":
      return 50;

    case "Epic":
      return 100;

    case "Legendary":
      return 250;

    default:
      return 0;
  }
}

/**
 * Calculate XP for an observation.
 */
export function calculateObservationXP(
  rarity: Rarity,
  isNewSpecies: boolean
): number {
  const baseXP = 50;

  const rarityBonus =
    getRarityBonus(rarity);

  const newSpeciesBonus =
    isNewSpecies ? 100 : 0;

  return (
    baseXP +
    rarityBonus +
    newSpeciesBonus
  );
}