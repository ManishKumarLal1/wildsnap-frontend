import { getToken } from "@/storage/authStorage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getMyCollection() {
  const token = await getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${API_URL}/collections`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch collection"
    );
  }

  return data.collection;
}