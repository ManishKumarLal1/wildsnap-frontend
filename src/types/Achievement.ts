export type AchievementCategory =
  | "Discovery"
  | "Streak"
  | "Observation"
  | "Rarity"
  | "Explorer";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;

  target: number;

  current: number;

  unlocked: boolean;

  rewardXP: number;
}