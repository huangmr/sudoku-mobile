import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGameStore } from '@/game/gameStore';

function barColor(pct: number): string {
  if (pct > 0.5) return '#4caf50';   // green  > 50%
  if (pct > 0.25) return '#ffc107';  // yellow > 25%
  if (pct > 0.1) return '#ff9800';   // orange > 10%
  return '#f44336';                   // red    <= 10%
}

export function TimerBar() {
  const { elapsedSeconds, timeLimit, status } = useGameStore();
  if (timeLimit === 0) return null;

  const pct = Math.max(0, Math.min(1, (timeLimit - elapsedSeconds) / timeLimit));
  const color = barColor(pct);
  const active = status === 'playing' || status === 'paused';

  if (!active) return null;

  return (
    <View style={styles.track}>
      {/* Fill anchored to the right */}
      <View style={[styles.fill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 5,
    backgroundColor: 'rgba(128,128,128,0.18)',
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'flex-end', // fill sits on the right
  },
  fill: { height: 5, borderRadius: 3 },
});
