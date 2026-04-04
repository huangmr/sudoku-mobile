import { create } from "zustand";
import { Board } from "@/puzzle/solver";
import { Puzzle } from "@/puzzle/generator";
import { LEVEL_CONFIG } from "@/puzzle/difficulty";
import { computeConflicts, isBoardComplete, isWrongEntry } from "./validation";

export type GameStatus =
  | "idle"
  | "playing"
  | "paused"
  | "completed"
  | "gameover";

type GameState = {
  puzzle: Puzzle | null;
  board: Board;
  conflicts: boolean[][];
  selectedCell: [number, number] | null;
  sessionLives: number;
  mistakes: number;
  elapsedSeconds: number;
  timeLimit: number;
  status: GameStatus;

  startGame: (puzzle: Puzzle) => void;
  selectCell: (row: number, col: number) => void;
  enterNumber: (num: number) => void;
  eraseCell: () => void;
  pause: () => void;
  resume: () => void;
  tickTimer: () => void;
  reset: () => void;
  addLife: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  puzzle: null,
  board: [],
  conflicts: [],
  selectedCell: null,
  sessionLives: 5,
  mistakes: 0,
  elapsedSeconds: 0,
  timeLimit: 0,
  status: "idle",

  startGame: (puzzle) =>
    set(() => ({
      puzzle,
      board: puzzle.board.map((r) => [...r]),
      conflicts: computeConflicts(puzzle.board),
      selectedCell: null,
      mistakes: 0,
      elapsedSeconds: 0,
      timeLimit: LEVEL_CONFIG[puzzle.level].timeLimitSeconds,
      status: "playing",
      // sessionLives intentionally preserved across games
    })),

  selectCell: (row, col) => {
    const { puzzle } = get();
    if (!puzzle || puzzle.clues[row][col]) return;
    set({ selectedCell: [row, col] });
  },

  enterNumber: (num) => {
    const { puzzle, board, selectedCell, mistakes, status } = get();
    if (!puzzle || !selectedCell || status !== "playing") return;
    const [r, c] = selectedCell;
    if (puzzle.clues[r][c]) return;

    const newBoard: Board = board.map((row) => [...row]);
    newBoard[r][c] = num;

    const wrong = isWrongEntry(newBoard, puzzle.solution, r, c);
    const newMistakes = wrong ? mistakes + 1 : mistakes;

    if (wrong) newBoard[r][c] = 0; // clear wrong entry, but no life loss

    const newConflicts = computeConflicts(newBoard);
    const complete = !wrong && isBoardComplete(newBoard, puzzle.solution);

    set({
      board: newBoard,
      conflicts: newConflicts,
      mistakes: newMistakes,
      status: complete ? "completed" : "playing",
    });
  },

  eraseCell: () => {
    const { puzzle, board, selectedCell, status } = get();
    if (!puzzle || !selectedCell || status !== "playing") return;
    const [r, c] = selectedCell;
    if (puzzle.clues[r][c]) return;

    const newBoard: Board = board.map((row) => [...row]);
    newBoard[r][c] = 0;
    set({ board: newBoard, conflicts: computeConflicts(newBoard) });
  },

  pause: () => set({ status: "paused" }),
  resume: () => set({ status: "playing" }),

  tickTimer: () => {
    const { status, elapsedSeconds, timeLimit, sessionLives } = get();
    if (status !== "playing") return;
    const newElapsed = elapsedSeconds + 1;
    if (timeLimit > 0 && newElapsed >= timeLimit) {
      set({
        elapsedSeconds: timeLimit,
        status: "gameover",
        sessionLives: Math.max(0, sessionLives - 1),
      });
    } else {
      set({ elapsedSeconds: newElapsed });
    }
  },

  addLife: () => set((s) => ({ sessionLives: s.sessionLives + 1 })),

  reset: () =>
    set({
      puzzle: null,
      board: [],
      conflicts: [],
      selectedCell: null,
      mistakes: 0,
      elapsedSeconds: 0,
      timeLimit: 0,
      status: "idle",
      // sessionLives intentionally preserved
    }),
}));
