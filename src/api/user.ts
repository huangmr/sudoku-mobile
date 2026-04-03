import { apiClient } from './client';

export type UserProfile = {
  id: string;
  displayName: string;
  avatarUrl: string;
  diamonds: number;
  currentStreak: number;
  longestStreak: number;
};

export async function getMe(): Promise<UserProfile> {
  const res = await apiClient.get('/users/me');
  return res.data;
}
