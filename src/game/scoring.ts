import { Level, LEVEL_CONFIG } from '@/puzzle/difficulty';

export function calculateScore(
  level: Level,
  timeTakenSeconds: number,
  mistakes: number
): number {
  const { baseScore, timeLimitSeconds, timeMultiplier } = LEVEL_CONFIG[level];
  const timeBonus = Math.max(0, (timeLimitSeconds - timeTakenSeconds) * timeMultiplier);
  const penalty = mistakes * 200;
  return Math.max(0, baseScore + timeBonus - penalty);
}
