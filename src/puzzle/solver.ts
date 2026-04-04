export type Board = number[][]; // 9×9, 0 = empty

function isValid(board: Board, row: number, col: number, num: number): boolean {
  // Row check
  if (board[row].includes(num)) return false;
  // Column check
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  // 3×3 box check
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

/**
 * Solves the board in-place using backtracking.
 * Returns the number of solutions found (stops at 2 to check uniqueness).
 */
export function countSolutions(board: Board, limit = 2): number {
  const clone: Board = board.map((r) => [...r]);
  let count = 0;

  function solve(): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (clone[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(clone, row, col, num)) {
              clone[row][col] = num;
              if (solve()) {
                // propagate up only if we've hit the limit
              }
              clone[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }

  solve();
  return count;
}

/** Returns true if the board has exactly one solution */
export function hasUniqueSolution(board: Board): boolean {
  return countSolutions(board, 2) === 1;
}

/** Fills an empty board with a complete valid solution using backtracking + shuffle */
export function fillSolution(board: Board, random: () => number): boolean {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const shuffled = shuffleNums(digits, random);
        for (const num of shuffled) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillSolution(board, random)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function shuffleNums(arr: number[], random: () => number): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
