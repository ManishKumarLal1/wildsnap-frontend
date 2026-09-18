export type SpeciesCategory =
  | "Bird"
  | "Mammal"
  | "Reptile"
  | "Amphibian"
  | "Insect"
  | "Fish";

export type Rarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary";

export interface Species {
  id: string;
  name: string;
  scientificName: string;
  category: SpeciesCategory;
  rarity: Rarity;
  emoji: string;

  discovered: boolean;
  discoveryCount: number;

  xp: number;
}