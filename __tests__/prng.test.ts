import { fnv1a32, mulberry32, seededRandom, shuffle } from "../src/puzzle/prng";

describe("fnv1a32", () => {
  test("is deterministic", () => {
    expect(fnv1a32("hello")).toBe(fnv1a32("hello"));
  });

  test("different strings produce different hashes", () => {
    expect(fnv1a32("abc")).not.toBe(fnv1a32("xyz"));
  });

  test("empty string returns hash", () => {
    expect(typeof fnv1a32("")).toBe("number");
  });

  test("returns unsigned 32-bit integer", () => {
    const h = fnv1a32("test");
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(0xffffffff);
  });
});

describe("mulberry32", () => {
  test("produces values in [0, 1)", () => {
    const rng = mulberry32(12345);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  test("is deterministic with same seed", () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);
    for (let i = 0; i < 20; i++) {
      expect(rng1()).toBe(rng2());
    }
  });

  test("different seeds produce different sequences", () => {
    const rng1 = mulberry32(1);
    const rng2 = mulberry32(2);
    const seq1 = Array.from({ length: 5 }, () => rng1());
    const seq2 = Array.from({ length: 5 }, () => rng2());
    expect(seq1).not.toEqual(seq2);
  });
});

describe("seededRandom", () => {
  test("same puzzleId produces same sequence", () => {
    const r1 = seededRandom("1.1");
    const r2 = seededRandom("1.1");
    expect(r1()).toBe(r2());
    expect(r1()).toBe(r2());
  });

  test("different puzzleIds produce different sequences", () => {
    const r1 = seededRandom("1.1");
    const r2 = seededRandom("1.2");
    const v1 = r1();
    const v2 = r2();
    expect(v1).not.toBe(v2);
  });
});

describe("shuffle", () => {
  test("preserves all elements", () => {
    const arr = [1, 2, 3, 4, 5];
    const rng = seededRandom("test");
    const result = shuffle(arr, rng);
    expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  test("does not mutate original array", () => {
    const arr = [1, 2, 3];
    const original = [...arr];
    const rng = seededRandom("test");
    shuffle(arr, rng);
    expect(arr).toEqual(original);
  });

  test("same seed produces same shuffle", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const r1 = seededRandom("x");
    const r2 = seededRandom("x");
    expect(shuffle(arr, r1)).toEqual(shuffle(arr, r2));
  });

  test("empty array returns empty array", () => {
    const rng = seededRandom("test");
    expect(shuffle([], rng)).toEqual([]);
  });

  test("single element array returns same", () => {
    const rng = seededRandom("test");
    expect(shuffle([42], rng)).toEqual([42]);
  });
});
