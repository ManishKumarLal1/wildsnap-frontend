const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getSpecies() {
  const response = await fetch(
    `${API_URL}/species`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch species"
    );
  }

  return data.species;
}

export async function getSpeciesById(
  id: string
) {
  const response = await fetch(
    `${API_URL}/species/${id}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch species"
    );
  }

  return data.species;
}

export async function getSpeciesByName(
  name: string
) {
  // We use encodeURIComponent to handle spaces (e.g., "Indian Peafowl" -> "Indian%20Peafowl")
  const response = await fetch(
    `${API_URL}/species/name/${encodeURIComponent(name)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch species"
    );
  }

  return data.species;
}