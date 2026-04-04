import { useGameStore } from '../src/game/gameStore';
import { generatePuzzle } from '../src/puzzle/generator';

function loadEasyPuzzle(id = 'e.1') {
  const puzzle = generatePuzzle(id, 'easy');
  useGameStore.getState().startGame(puzzle);
  return puzzle;
}

beforeEach(() => {
  useGameStore.getState().reset();
});

describe('startGame', () => {
  test('sets status to playing', () => {
    loadEasyPuzzle();
    expect(useGameStore.getState().status).toBe('playing');
  });

  test('resets elapsed seconds and mistakes', () => {
    useGameStore.setState({ elapsedSeconds: 100, mistakes: 5 });
    loadEasyPuzzle();
    expect(useGameStore.getState().elapsedSeconds).toBe(0);
    expect(useGameStore.getState().mistakes).toBe(0);
  });

  test('sets timeLimit from level config', () => {
    loadEasyPuzzle();
    expect(useGameStore.getState().timeLimit).toBe(900); // easy = 900s
  });

  test('preserves sessionLives across games', () => {
    useGameStore.setState({ sessionLives: 3 });
    loadEasyPuzzle();
    expect(useGameStore.getState().sessionLives).toBe(3);
  });
});

describe('selectCell', () => {
  test('selects a non-clue cell', () => {
    const puzzle = loadEasyPuzzle();
    // Find first non-clue cell
    let r = 0, c = 0;
    outer: for (r = 0; r < 9; r++) {
      for (c = 0; c < 9; c++) {
        if (!puzzle.clues[r][c]) break outer;
      }
    }
    useGameStore.getState().selectCell(r, c);
    expect(useGameStore.getState().selectedCell).toEqual([r, c]);
  });

  test('does not select a clue cell', () => {
    const puzzle = loadEasyPuzzle();
    // Find first clue cell
    let r = 0, c = 0;
    outer: for (r = 0; r < 9; r++) {
      for (c = 0; c < 9; c++) {
        if (puzzle.clues[r][c]) break outer;
      }
    }
    useGameStore.getState().selectCell(r, c);
    expect(useGameStore.getState().selectedCell).toBeNull();
  });

  test('does nothing when no puzzle loaded', () => {
    useGameStore.getState().selectCell(0, 0);
    expect(useGameStore.getState().selectedCell).toBeNull();
  });
});

describe('enterNumber', () => {
  test('does nothing when no cell selected', () => {
    const puzzle = loadEasyPuzzle();
    const boardBefore = useGameStore.getState().board.map(r => [...r]);
    useGameStore.getState().enterNumber(5);
    expect(useGameStore.getState().board).toEqual(boardBefore);
  });

  test('does nothing when status is not playing', () => {
    loadEasyPuzzle();
    useGameStore.setState({ status: 'paused', selectedCell: [0, 0] });
    const boardBefore = useGameStore.getState().board.map(r => [...r]);
    useGameStore.getState().enterNumber(5);
    expect(useGameStore.getState().board).toEqual(boardBefore);
  });

  test('wrong entry clears cell and increments mistakes', () => {
    const puzzle = loadEasyPuzzle();
    let r = 0, c = 0;
    outer: for (r = 0; r < 9; r++) {
      for (c = 0; c < 9; c++) {
        if (!puzzle.clues[r][c]) break outer;
      }
    }
    useGameStore.getState().selectCell(r, c);
    const correctVal = puzzle.solution[r][c];
    const wrongVal = (correctVal % 9) + 1; // guaranteed different
    useGameStore.getState().enterNumber(wrongVal);
    expect(useGameStore.getState().board[r][c]).toBe(0); // cleared
    expect(useGameStore.getState().mistakes).toBe(1);
  });

  test('correct entry fills cell', () => {
    const puzzle = loadEasyPuzzle();
    let r = 0, c = 0;
    outer: for (r = 0; r < 9; r++) {
      for (c = 0; c < 9; c++) {
        if (!puzzle.clues[r][c]) break outer;
      }
    }
    useGameStore.getState().selectCell(r, c);
    const correctVal = puzzle.solution[r][c];
    useGameStore.getState().enterNumber(correctVal);
    expect(useGameStore.getState().board[r][c]).toBe(correctVal);
    expect(useGameStore.getState().mistakes).toBe(0);
  });

  test('completing the board sets status to completed', () => {
    const puzzle = generatePuzzle('e.99', 'easy');
    useGameStore.getState().startGame(puzzle);
    // Fill all empty cells with correct values
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!puzzle.clues[r][c]) {
          useGameStore.getState().selectCell(r, c);
          useGameStore.getState().enterNumber(puzzle.solution[r][c]);
        }
      }
    }
    expect(useGameStore.getState().status).toBe('completed');
  });
});

describe('eraseCell', () => {
  test('clears a user-filled cell', () => {
    const puzzle = loadEasyPuzzle();
    let r = 0, c = 0;
    outer: for (r = 0; r < 9; r++) {
      for (c = 0; c < 9; c++) {
        if (!puzzle.clues[r][c]) break outer;
      }
    }
    // Fill the cell first with correct value
    useGameStore.getState().selectCell(r, c);
    useGameStore.getState().enterNumber(puzzle.solution[r][c]);
    expect(useGameStore.getState().board[r][c]).toBe(puzzle.solution[r][c]);
    // Now erase
    useGameStore.getState().eraseCell();
    expect(useGameStore.getState().board[r][c]).toBe(0);
  });

  test('does not erase a clue cell', () => {
    const puzzle = loadEasyPuzzle();
    let r = 0, c = 0;
    outer: for (r = 0; r < 9; r++) {
      for (c = 0; c < 9; c++) {
        if (puzzle.clues[r][c]) break outer;
      }
    }
    const cluVal = puzzle.board[r][c];
    // Force-select a clue cell by directly setting selectedCell
    useGameStore.setState({ selectedCell: [r, c] });
    useGameStore.getState().eraseCell();
    expect(useGameStore.getState().board[r][c]).toBe(cluVal); // unchanged
  });

  test('does nothing when no cell selected', () => {
    loadEasyPuzzle();
    const boardBefore = useGameStore.getState().board.map(r => [...r]);
    useGameStore.getState().eraseCell();
    expect(useGameStore.getState().board).toEqual(boardBefore);
  });

  test('does nothing when status is not playing', () => {
    loadEasyPuzzle();
    useGameStore.setState({ status: 'paused', selectedCell: [0, 0] });
    const boardBefore = useGameStore.getState().board.map(r => [...r]);
    useGameStore.getState().eraseCell();
    expect(useGameStore.getState().board).toEqual(boardBefore);
  });
});

describe('pause and resume', () => {
  test('pause sets status to paused', () => {
    loadEasyPuzzle();
    useGameStore.getState().pause();
    expect(useGameStore.getState().status).toBe('paused');
  });

  test('resume sets status to playing', () => {
    loadEasyPuzzle();
    useGameStore.getState().pause();
    useGameStore.getState().resume();
    expect(useGameStore.getState().status).toBe('playing');
  });
});

describe('tickTimer', () => {
  test('increments elapsedSeconds when playing', () => {
    loadEasyPuzzle();
    useGameStore.getState().tickTimer();
    expect(useGameStore.getState().elapsedSeconds).toBe(1);
  });

  test('does not increment when paused', () => {
    loadEasyPuzzle();
    useGameStore.getState().pause();
    useGameStore.getState().tickTimer();
    expect(useGameStore.getState().elapsedSeconds).toBe(0);
  });

  test('does not increment when idle', () => {
    useGameStore.getState().tickTimer();
    expect(useGameStore.getState().elapsedSeconds).toBe(0);
  });

  test('triggers gameover when time limit reached', () => {
    loadEasyPuzzle();
    useGameStore.setState({ elapsedSeconds: 899, sessionLives: 5 });
    useGameStore.getState().tickTimer();
    expect(useGameStore.getState().status).toBe('gameover');
    expect(useGameStore.getState().elapsedSeconds).toBe(900);
    expect(useGameStore.getState().sessionLives).toBe(4);
  });

  test('does not trigger gameover when timeLimit is 0', () => {
    loadEasyPuzzle();
    useGameStore.setState({ timeLimit: 0, elapsedSeconds: 9999 });
    useGameStore.getState().tickTimer();
    expect(useGameStore.getState().status).toBe('playing');
  });

  test('sessionLives does not go below 0 on gameover', () => {
    loadEasyPuzzle();
    useGameStore.setState({ elapsedSeconds: 899, sessionLives: 0 });
    useGameStore.getState().tickTimer();
    expect(useGameStore.getState().sessionLives).toBe(0);
  });
});

describe('addLife', () => {
  test('increments sessionLives', () => {
    loadEasyPuzzle();
    const before = useGameStore.getState().sessionLives;
    useGameStore.getState().addLife();
    expect(useGameStore.getState().sessionLives).toBe(before + 1);
  });
});

describe('reset', () => {
  test('resets to idle state', () => {
    loadEasyPuzzle();
    useGameStore.getState().reset();
    const s = useGameStore.getState();
    expect(s.status).toBe('idle');
    expect(s.puzzle).toBeNull();
    expect(s.board).toEqual([]);
    expect(s.elapsedSeconds).toBe(0);
    expect(s.mistakes).toBe(0);
  });

  test('preserves sessionLives', () => {
    useGameStore.setState({ sessionLives: 3 });
    useGameStore.getState().reset();
    expect(useGameStore.getState().sessionLives).toBe(3);
  });
});
