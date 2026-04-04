import { Board } from "@/puzzle/solver";

/**
 * Returns a 9×9 boolean grid where true = cell is in conflict
 * (duplicate in row, column, or 3×3 box)
 */
export function computeConflicts(board: Board): boolean[][] {
  const conflicts: boolean[][] = Array.from({ length: 9 }, () =>
    Array(9).fill(false),
  );

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val === 0) continue;

      // Check row
      for (let cc = 0; cc < 9; cc++) {
        if (cc !== c && board[r][cc] === val) {
          conflicts[r][c] = true;
          conflicts[r][cc] = true;
        }
      }
      // Check column
      for (let rr = 0; rr < 9; rr++) {
        if (rr !== r && board[rr][c] === val) {
          conflicts[r][c] = true;
          conflicts[rr][c] = true;
        }
      }
      // Check 3×3 box
      const br = Math.floor(r / 3) * 3;
      const bc = Math.floor(c / 3) * 3;
      for (let rr = br; rr < br + 3; rr++) {
        for (let cc = bc; cc < bc + 3; cc++) {
          if ((rr !== r || cc !== c) && board[rr][cc] === val) {
            conflicts[r][c] = true;
            conflicts[rr][cc] = true;
          }
        }
      }
    }
  }
  return conflicts;
}

/** Returns true when board matches solution (all 81 cells filled correctly) */
export function isBoardComplete(board: Board, solution: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}

/** Returns true when the value placed at (row, col) conflicts with the solution */
export function isWrongEntry(
  board: Board,
  solution: Board,
  row: number,
  col: number,
): boolean {
  return board[row][col] !== 0 && board[row][col] !== solution[row][col];
}
