import {
  LEVEL_CONFIG,
  levelFromCode,
  puzzleId,
  levelFromPuzzleId,
} from "../src/puzzle/difficulty";

describe("LEVEL_CONFIG", () => {
  test("all four levels are defined", () => {
    expect(LEVEL_CONFIG.easy).toBeDefined();
    expect(LEVEL_CONFIG.medium).toBeDefined();
    expect(LEVEL_CONFIG.hard).toBeDefined();
    expect(LEVEL_CONFIG.horror).toBeDefined();
  });

  test("codes are 1-4", () => {
    expect(LEVEL_CONFIG.easy.code).toBe(1);
    expect(LEVEL_CONFIG.medium.code).toBe(2);
    expect(LEVEL_CONFIG.hard.code).toBe(3);
    expect(LEVEL_CONFIG.horror.code).toBe(4);
  });
});

describe("levelFromCode", () => {
  test("maps code 1 to easy", () => expect(levelFromCode(1)).toBe("easy"));
  test("maps code 2 to medium", () => expect(levelFromCode(2)).toBe("medium"));
  test("maps code 3 to hard", () => expect(levelFromCode(3)).toBe("hard"));
  test("maps code 4 to horror", () => expect(levelFromCode(4)).toBe("horror"));

  test("throws on unknown code", () => {
    expect(() => levelFromCode(99)).toThrow("Unknown level code: 99");
  });
});

describe("puzzleId", () => {
  test("formats correctly", () => {
    expect(puzzleId("easy", 5)).toBe("1.5");
    expect(puzzleId("medium", 10)).toBe("2.10");
    expect(puzzleId("hard", 1)).toBe("3.1");
    expect(puzzleId("horror", 999)).toBe("4.999");
  });
});

describe("levelFromPuzzleId", () => {
  test("extracts level from puzzle ID", () => {
    expect(levelFromPuzzleId("1.5")).toBe("easy");
    expect(levelFromPuzzleId("2.10")).toBe("medium");
    expect(levelFromPuzzleId("3.1")).toBe("hard");
    expect(levelFromPuzzleId("4.999")).toBe("horror");
  });

  test("throws on invalid puzzle ID", () => {
    expect(() => levelFromPuzzleId("99.1")).toThrow();
  });
});
