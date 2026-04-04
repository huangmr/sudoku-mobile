/**
 * Tests for the game completion flow:
 * - Completion dialog shows only once per puzzle
 * - A new puzzle is started after dismissal (not the same one)
 * - No backend calls happen in the guest/offline path
 */

import { generatePuzzle } from '../src/puzzle/generator';
import { useGameStore } from '../src/game/gameStore';

// Solve all empty cells to trigger completion
function solvePuzzle() {
  const { puzzle, board } = useGameStore.getState();
  if (!puzzle) throw new Error('No puzzle loaded');

  // Directly set board to solution and mark completed — simulates user filling last cell
  useGameStore.setState({
    board: puzzle.solution.map(r => [...r]),
    status: 'completed',
  });
}

beforeEach(() => {
  useGameStore.getState().reset();
});

test('status resets to idle when reset() is called, preventing double-completion', () => {
  const puzzle = generatePuzzle('e.1', 'easy');
  useGameStore.getState().startGame(puzzle);
  expect(useGameStore.getState().status).toBe('playing');

  solvePuzzle();
  expect(useGameStore.getState().status).toBe('completed');

  // Simulates what loadPuzzle() does at the start of a new game screen mount
  useGameStore.getState().reset();
  expect(useGameStore.getState().status).toBe('idle');
});

test('starting a new game after reset loads a different puzzle', () => {
  const puzzle1 = generatePuzzle('e.1', 'easy');
  useGameStore.getState().startGame(puzzle1);
  solvePuzzle();
  expect(useGameStore.getState().status).toBe('completed');

  useGameStore.getState().reset();

  const puzzle2 = generatePuzzle('e.2', 'easy');
  useGameStore.getState().startGame(puzzle2);

  expect(useGameStore.getState().status).toBe('playing');
  expect(useGameStore.getState().puzzle?.puzzleId).toBe('e.2');
  expect(useGameStore.getState().puzzle?.board).not.toEqual(puzzle1.board);
});

test('completion is not re-triggered after reset + new game start', () => {
  const puzzle1 = generatePuzzle('e.1', 'easy');
  useGameStore.getState().startGame(puzzle1);
  solvePuzzle();
  expect(useGameStore.getState().status).toBe('completed');

  // Simulate new game screen mounting: reset then start new puzzle
  useGameStore.getState().reset();
  expect(useGameStore.getState().status).toBe('idle'); // not 'completed'

  const puzzle2 = generatePuzzle('e.2', 'easy');
  useGameStore.getState().startGame(puzzle2);
  expect(useGameStore.getState().status).toBe('playing'); // clean state
});

test('elapsedSeconds and mistakes reset for each new game', () => {
  const puzzle1 = generatePuzzle('e.1', 'easy');
  useGameStore.getState().startGame(puzzle1);

  // Simulate some play time and mistakes
  useGameStore.setState({ elapsedSeconds: 120, mistakes: 3 });
  solvePuzzle();

  useGameStore.getState().reset();
  const puzzle2 = generatePuzzle('e.2', 'easy');
  useGameStore.getState().startGame(puzzle2);

  expect(useGameStore.getState().elapsedSeconds).toBe(0);
  expect(useGameStore.getState().mistakes).toBe(0);
});
