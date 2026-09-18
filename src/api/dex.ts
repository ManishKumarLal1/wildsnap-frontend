import { getToken } from "@/storage/authStorage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface DexSpecies {
  id: string;
  name: string;
  scientific_name: string;

  category:
    | "Bird"
    | "Mammal"
    | "Reptile"
    | "Amphibian"
    | "Insect"
    | "Fish";

  rarity:
    | "Common"
    | "Uncommon"
    | "Rare"
    | "Epic"
    | "Legendary";

  description: string;
  habitat: string;
  diet: string;
  conservation_status: string;

  image_url: string | null;
  silhouette_url: string | null;

  discovered: boolean;
  discovery_count: number;

  first_discovered_at: string | null;
  last_discovered_at: string | null;
}

export interface DexResponse {
  success: boolean;
  totalSpecies: number;
  discoveredSpecies: number;
  species: DexSpecies[];
}

export async function getWildDex(): Promise<DexResponse> {
  const token = await getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_URL}/dex`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseText = await response.text();

  console.log("GET /dex status:", response.status);
  console.log("GET /dex response:", responseText);

  let data: DexResponse;

  try {
    data = JSON.parse(responseText) as DexResponse;
  } catch {
    throw new Error(
      `Wild Dex returned an invalid response (${response.status})`
    );
  }

  if (!response.ok) {
    throw new Error(
      (data as any).message ||
        `Failed to fetch Wild Dex (${response.status})`
    );
  }

  return data;
}