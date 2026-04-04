import { seededRandom } from "./prng";
import { fillSolution, hasUniqueSolution, Board } from "./solver";
import { Level, LEVEL_CONFIG } from "./difficulty";

export type Puzzle = {
  puzzleId: string;
  level: Level;
  /** 9×9 board where 0 = empty cell (user fills in) */
  board: Board;
  /** 9×9 solution board — all cells filled */
  solution: Board;
  /** boolean mask: true = pre-filled clue, cannot be edited */
  clues: boolean[][];
};

export function generatePuzzle(puzzleId: string, level: Level): Puzzle {
  const random = seededRandom(puzzleId);
  const { cluesTarget } = LEVEL_CONFIG[level];

  // Step 1: generate a complete solution
  const solution: Board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillSolution(solution, random);

  // Step 2: copy solution to working board, then remove cells
  const board: Board = solution.map((r) => [...r]);
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++) positions.push([r, c]);

  // Shuffle removal order
  const shuffled = shufflePositions(positions, random);
  let cluesLeft = 81;

  for (const [r, c] of shuffled) {
    if (cluesLeft <= cluesTarget) break;
    const backup = board[r][c];
    board[r][c] = 0;
    if (!hasUniqueSolution(board)) {
      board[r][c] = backup; // restore — removing this cell breaks uniqueness
    } else {
      cluesLeft--;
    }
  }

  // Step 3: build clue mask
  const clues: boolean[][] = board.map((row) => row.map((cell) => cell !== 0));

  return { puzzleId, level, board, solution, clues };
}

function shufflePositions(
  positions: [number, number][],
  random: () => number,
): [number, number][] {
  const a = [...positions];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
