import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Cell } from './Cell';
import { useGameStore } from '@/game/gameStore';
import { useTheme } from '@/theme/ThemeContext';

function GridLines({ faint, strong }: { faint: string; strong: string }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => {
        const isBox = i % 3 === 0;
        const thickness = isBox ? 2 : 1;
        const color = isBox ? strong : faint;
        const pct = `${(i / 9) * 100}%` as `${number}%`;
        return (
          <React.Fragment key={i}>
            <View style={{ position: 'absolute', left: 0, right: 0, top: pct, height: thickness, backgroundColor: color }} />
            <View style={{ position: 'absolute', top: 0, bottom: 0, left: pct, width: thickness, backgroundColor: color }} />
          </React.Fragment>
        );
      })}
    </View>
  );
}

export function SudokuBoard() {
  const { board, conflicts, selectedCell, puzzle, selectCell } = useGameStore();
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
            />
          ))}
        </View>
      ))}
      <GridLines faint={colors.borderFaint} strong={colors.borderStrong} />
    </View>
  );
}

const styles = StyleSheet.create({
  board: { width: '100%', aspectRatio: 1 },
  row: { flex: 1, flexDirection: 'row' },
});
