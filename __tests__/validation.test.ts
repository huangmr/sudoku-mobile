import { computeConflicts, isBoardComplete, isWrongEntry } from '../src/game/validation';

const emptyRow = () => Array(9).fill(0);

test('no conflicts on empty board', () => {
  const board = Array.from({ length: 9 }, emptyRow);
  const c = computeConflicts(board);
  expect(c.flat().every(v => !v)).toBe(true);
});

test('detects row conflict', () => {
  const board = Array.from({ length: 9 }, emptyRow);
  board[0][0] = 5;
  board[0][5] = 5;
  const c = computeConflicts(board);
  expect(c[0][0]).toBe(true);
  expect(c[0][5]).toBe(true);
  expect(c[0][1]).toBe(false);
});

test('isBoardComplete returns true when board matches solution', () => {
  const sol = Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 9 }, (_, c) => ((r * 9 + c) % 9) + 1)
  );
  expect(isBoardComplete(sol.map(r => [...r]), sol)).toBe(true);
});

test('isWrongEntry detects mismatch', () => {
  const board = Array.from({ length: 9 }, emptyRow);
  const solution = Array.from({ length: 9 }, emptyRow);
  solution[0][0] = 5;
  board[0][0] = 3;
  expect(isWrongEntry(board, solution, 0, 0)).toBe(true);
});
