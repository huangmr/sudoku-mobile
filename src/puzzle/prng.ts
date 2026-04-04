/** FNV-1a 32-bit hash — deterministically maps a string to a uint32 */
export function fnv1a32(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

/** Mulberry32 — fast, deterministic uint32 PRNG seeded with a uint32 */
export function mulberry32(seed: number) {
  let s = seed >>> 0;
  return function (): number {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Returns a PRNG function seeded from a puzzle ID string */
export function seededRandom(puzzleId: string) {
  return mulberry32(fnv1a32(puzzleId));
}

/** Fisher-Yates shuffle using a provided random fn */
export function shuffle<T>(arr: T[], random: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
