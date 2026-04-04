import { apiClient } from "./client";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string;
  score: number;
  level: number;
  timeTakenSeconds: number;
};

export async function getDailyLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await apiClient.get("/leaderboard/daily");
  return res.data;
}

export async function getAllTimeLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await apiClient.get("/leaderboard/alltime");
  return res.data;
}
