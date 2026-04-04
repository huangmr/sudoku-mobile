import { calculateScore } from '../src/game/scoring';

test('perfect easy game scores baseScore + full timeBonus', () => {
  const score = calculateScore('easy', 0, 0);
  expect(score).toBe(1000 + 900 * 2); // 2800
});

test('slow game still gets base score', () => {
  const score = calculateScore('easy', 9999, 0);
  expect(score).toBe(1000); // timeBonus = 0
});

test('mistakes reduce score', () => {
  const score = calculateScore('easy', 0, 2);
  expect(score).toBe(1000 + 900 * 2 - 2 * 200); // 2400
});

test('score cannot go negative', () => {
  const score = calculateScore('easy', 9999, 100);
  expect(score).toBe(0);
});

test('medium: perfect score', () => {
  // medium: base=2000, timeLimit=1320, multiplier=3
  expect(calculateScore('medium', 0, 0)).toBe(2000 + 1320 * 3);
});

test('medium: at time limit gets base only', () => {
  expect(calculateScore('medium', 9999, 0)).toBe(2000);
});

test('hard: perfect score', () => {
  // hard: base=3000, timeLimit=2100, multiplier=4
  expect(calculateScore('hard', 0, 0)).toBe(3000 + 2100 * 4);
});

test('horror: perfect score', () => {
  // horror: base=4000, timeLimit=3300, multiplier=5
  expect(calculateScore('horror', 0, 0)).toBe(4000 + 3300 * 5);
});

test('time bonus is zero when time equals limit', () => {
  expect(calculateScore('easy', 900, 0)).toBe(1000);
});

test('time bonus is zero when time exceeds limit', () => {
  expect(calculateScore('easy', 1000, 0)).toBe(1000);
});
