import { calculateScore } from '../src/game/scoring';

test('perfect easy game scores baseScore + full timeBonus', () => {
  const score = calculateScore('easy', 0, 0);
  expect(score).toBe(1000 + 600 * 2); // 2200
});

test('slow game still gets base score', () => {
  const score = calculateScore('easy', 9999, 0);
  expect(score).toBe(1000); // timeBonus = 0
});

test('mistakes reduce score', () => {
  const score = calculateScore('easy', 0, 2);
  expect(score).toBe(1000 + 600 * 2 - 2 * 200); // 1800
});

test('score cannot go negative', () => {
  const score = calculateScore('easy', 9999, 100);
  expect(score).toBe(0);
});
