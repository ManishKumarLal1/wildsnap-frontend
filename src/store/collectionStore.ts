import { Species } from "@/types/Species";

export const speciesCollection: Species[] = [
  {
    id: "indian-peafowl",
    name: "Indian Peafowl",
    scientificName: "Pavo cristatus",
    category: "Bird",
    rarity: "Rare",
    emoji: "🦚",
    discovered: true,
    discoveryCount: 2,
    xp: 180,
  },

  {
    id: "common-mormon",
    name: "Common Mormon",
    scientificName: "Papilio polytes",
    category: "Insect",
    rarity: "Common",
    emoji: "🦋",
    discovered: true,
    discoveryCount: 5,
    xp: 50,
  },

  {
    id: "bengal-tiger",
    name: "Bengal Tiger",
    scientificName: "Panthera tigris",
    category: "Mammal",
    rarity: "Legendary",
    emoji: "🐅",
    discovered: true,
    discoveryCount: 1,
    xp: 1000,
  },

  {
    id: "chital",
    name: "Chital",
    scientificName: "Axis axis",
    category: "Mammal",
    rarity: "Uncommon",
    emoji: "🦌",
    discovered: true,
    discoveryCount: 3,
    xp: 100,
  },

  {
    id: "indian-cobra",
    name: "Indian Cobra",
    scientificName: "Naja naja",
    category: "Reptile",
    rarity: "Rare",
    emoji: "🐍",
    discovered: false,
    discoveryCount: 0,
    xp: 250,
  },

  {
    id: "asian-elephant",
    name: "Asian Elephant",
    scientificName: "Elephas maximus",
    category: "Mammal",
    rarity: "Epic",
    emoji: "🐘",
    discovered: false,
    discoveryCount: 0,
    xp: 500,
  },

  {
    id: "gaur",
    name: "Gaur",
    scientificName: "Bos gaurus",
    category: "Mammal",
    rarity: "Rare",
    emoji: "🐂",
    discovered: false,
    discoveryCount: 0,
    xp: 250,
  },

  {
    id: "king-cobra",
    name: "King Cobra",
    scientificName: "Ophiophagus hannah",
    category: "Reptile",
    rarity: "Legendary",
    emoji: "🐍",
    discovered: false,
    discoveryCount: 0,
    xp: 1000,
  },
];