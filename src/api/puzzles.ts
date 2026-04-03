import { apiClient } from './client';

export async function getCompletedPuzzles(): Promise<string[]> {
  const res = await apiClient.get('/puzzles/completed');
  return res.data;
}

export async function markPuzzleCompleted(puzzleId: string): Promise<void> {
  await apiClient.post('/puzzles/completed', { puzzleId });
}
