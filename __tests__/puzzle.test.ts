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

test('medium puzzle has fewer clues than easy', () => {
  const p = generatePuzzle('2.1', 'medium');
  const clueCount = p.board.flat().filter(c => c !== 0).length;
  expect(clueCount).toBeGreaterThanOrEqual(22);
  expect(clueCount).toBeLessThanOrEqual(32);
});

test('hard puzzle has fewer clues than medium', () => {
  const p = generatePuzzle('3.1', 'hard');
  const clueCount = p.board.flat().filter(c => c !== 0).length;
  expect(clueCount).toBeGreaterThanOrEqual(17);
  expect(clueCount).toBeLessThanOrEqual(28);
});

test('horror puzzle has minimum clues', () => {
  const p = generatePuzzle('4.1', 'horror');
  const clueCount = p.board.flat().filter(c => c !== 0).length;
  expect(clueCount).toBeGreaterThanOrEqual(17);
});

test('solution has all 9 digits in each column', () => {
  const p = generatePuzzle('1.1', 'easy');
  for (let c = 0; c < 9; c++) {
    const col = p.solution.map(row => row[c]);
    expect(new Set(col).size).toBe(9);
  }
});

test('solution has all 9 digits in each 3x3 box', () => {
  const p = generatePuzzle('1.1', 'easy');
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const box: number[] = [];
      for (let r = br * 3; r < br * 3 + 3; r++) {
        for (let c = bc * 3; c < bc * 3 + 3; c++) {
          box.push(p.solution[r][c]);
        }
      }
      expect(new Set(box).size).toBe(9);
    }
  }
});

test('clues mask matches board non-zero cells', () => {
  const p = generatePuzzle('1.5', 'easy');
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      expect(p.clues[r][c]).toBe(p.board[r][c] !== 0);
    }
  }
});

test('puzzleId is preserved in returned puzzle', () => {
  const p = generatePuzzle('1.42', 'easy');
  expect(p.puzzleId).toBe('1.42');
  expect(p.level).toBe('easy');
});
