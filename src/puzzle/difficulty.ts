export type Level = "easy" | "medium" | "hard" | "horror";
export type LevelCode = 1 | 2 | 3 | 4;

export const LEVEL_CONFIG: Record<
  Level,
  {
    code: LevelCode;
    cluesTarget: number;
    timeLimitSeconds: number;
    timeMultiplier: number;
    baseScore: number;
  }
> = {
  easy: {
    code: 1,
    cluesTarget: 35,
    timeLimitSeconds: 1200,
    timeMultiplier: 2,
    baseScore: 1000,
  },
  medium: {
    code: 2,
    cluesTarget: 27,
    timeLimitSeconds: 1800,
    timeMultiplier: 3,
    baseScore: 2000,
  },
  hard: {
    code: 3,
    cluesTarget: 22,
    timeLimitSeconds: 2400,
    timeMultiplier: 4,
    baseScore: 3000,
  },
  horror: {
    code: 4,
    cluesTarget: 17,
    timeLimitSeconds: 3000,
    timeMultiplier: 5,
    baseScore: 4000,
  },
};

export function levelFromCode(code: number): Level {
  const entry = Object.entries(LEVEL_CONFIG).find(([, v]) => v.code === code);
  if (!entry) throw new Error(`Unknown level code: ${code}`);
  return entry[0] as Level;
}

export function puzzleId(level: Level, index: number): string {
  return `${LEVEL_CONFIG[level].code}.${index}`;
}

export function levelFromPuzzleId(id: string): Level {
  const code = parseInt(id.split(".")[0], 10);
  return levelFromCode(code);
}
