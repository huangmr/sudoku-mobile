jest.setTimeout(30000);

import { generatePuzzle } from '../src/puzzle/generator';

test('generates valid unique puzzle', () => {
  const puzzle = generatePuzzle('1.1', 'easy');
  // Each row in the solution should have all 9 digits
  for (const row of puzzle.solution) {
    expect(new Set(row).size).toBe(9);
  }
  // The board should have approximately 35 clues for easy
  const clueCount = puzzle.board.flat().filter(c => c !== 0).length;
  expect(clueCount).toBeGreaterThanOrEqual(30);
  expect(clueCount).toBeLessThanOrEqual(40);
  // Same ID always produces same board
  const puzzle2 = generatePuzzle('1.1', 'easy');
  expect(puzzle.board).toEqual(puzzle2.board);
});

test('different IDs produce different puzzles', () => {
  const p1 = generatePuzzle('1.1', 'easy');
  const p2 = generatePuzzle('1.2', 'easy');
  expect(p1.board).not.toEqual(p2.board);
});
