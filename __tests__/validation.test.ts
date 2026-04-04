import { computeConflicts, isBoardComplete, isWrongEntry } from '../src/game/validation';

const emptyBoard = () => Array.from({ length: 9 }, () => Array(9).fill(0));

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

test('detects column conflict', () => {
  const board = emptyBoard();
  board[0][3] = 7;
  board[6][3] = 7;
  const c = computeConflicts(board);
  expect(c[0][3]).toBe(true);
  expect(c[6][3]).toBe(true);
  expect(c[0][4]).toBe(false);
});

test('detects box conflict', () => {
  const board = emptyBoard();
  board[0][0] = 3;
  board[2][2] = 3; // same 3x3 box
  const c = computeConflicts(board);
  expect(c[0][0]).toBe(true);
  expect(c[2][2]).toBe(true);
  expect(c[0][3]).toBe(false); // different box
});

test('isBoardComplete returns false when any cell differs', () => {
  const sol = Array.from({ length: 9 }, (_, r) =>
    Array.from({ length: 9 }, (_, c) => ((r * 9 + c) % 9) + 1)
  );
  const board = sol.map(r => [...r]);
  board[4][4] = (board[4][4] % 9) + 1; // wrong value
  expect(isBoardComplete(board, sol)).toBe(false);
});

test('isWrongEntry returns false for zero (empty cell)', () => {
  const board = emptyBoard();
  const solution = emptyBoard();
  solution[0][0] = 5;
  expect(isWrongEntry(board, solution, 0, 0)).toBe(false);
});

test('isWrongEntry returns false when value matches solution', () => {
  const board = emptyBoard();
  const solution = emptyBoard();
  solution[3][3] = 9;
  board[3][3] = 9;
  expect(isWrongEntry(board, solution, 3, 3)).toBe(false);
});
