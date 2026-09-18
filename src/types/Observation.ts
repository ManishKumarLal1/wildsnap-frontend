import { Rarity } from "./Species";

export interface Observation {
  id: string;
  speciesId: string;
  speciesName: string;
  scientificName: string;
  confidence: number;
  rarity: Rarity;
  xpEarned: number;

  // Local image before upload
  imageUri?: string;

  // Cloudinary image after upload
  imageUrl?: string;

  // Optional Cloudinary identifier
  cloudinaryPublicId?: string;

  location?: string;
  createdAt: string;
}