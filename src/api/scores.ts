import { apiClient } from "./client";

export type SubmitScorePayload = {
  puzzleId: string;
  level: number;
  finalScore: number;
  timeTakenSeconds: number;
  mistakes: number;
};

export async function submitScore(payload: SubmitScorePayload) {
  const res = await apiClient.post("/scores", payload);
  return res.data;
}
