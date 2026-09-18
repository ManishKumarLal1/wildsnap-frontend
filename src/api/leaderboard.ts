import { getToken } from "@/storage/authStorage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export interface LeaderboardUser {
  id: string;
  username: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardUser[];
  rank: number;
}

export async function getLeaderboard(): Promise<LeaderboardResponse> {
  const token = await getToken();

  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(
    `${API_URL}/leaderboard`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch leaderboard"
    );
  }

  return data;
}