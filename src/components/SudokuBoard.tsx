import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Cell } from './Cell';
import { useGameStore } from '@/game/gameStore';
import { useTheme } from '@/theme/ThemeContext';

export function SudokuBoard() {
  const { board, conflicts, selectedCell, puzzle, selectCell, status } = useGameStore();
  const { colors } = useTheme();

  const isHighlighted = useCallback((r: number, c: number): boolean => {
    if (!selectedCell) return false;
    const [sr, sc] = selectedCell;
    if (r === sr || c === sc) return true;
    if (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3)) return true;
    return false;
  }, [selectedCell]);

  if (!puzzle || board.length === 0) return null;

  return (
    <View style={[styles.board, { borderWidth: 2, borderColor: colors.borderStrong }]}>
      {board.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((val, c) => (
            <Cell
              key={c}
              value={val}
              isClue={puzzle.clues[r][c]}
              isSelected={selectedCell?.[0] === r && selectedCell?.[1] === c}
              isHighlighted={!puzzle.clues[r][c] && isHighlighted(r, c)}
              isConflict={conflicts[r]?.[c] ?? false}
              onPress={() => selectCell(r, c)}
              boxBorderRight={c === 2 || c === 5}
              boxBorderBottom={r === 2 || r === 5}
              isLastCol={c === 8}
              isLastRow={r === 8}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { width: '100%', aspectRatio: 1 },
  row: { flex: 1, flexDirection: 'row' },
});
