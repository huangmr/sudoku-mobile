import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { useGameStore } from '@/game/gameStore';
import { useAuthStore } from '@/auth/authStore';

const COST = 10; // diamonds per life

type Props = { onBuyLife?: () => void };

export function LivesDisplay({ onBuyLife }: Props) {
  const { colors } = useTheme();
  const { sessionLives } = useGameStore();
  const { user } = useAuthStore();

  const canAfford = (user?.diamonds ?? 0) >= COST;

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map(i => (
        <Text key={i} style={[styles.heart, { color: i <= sessionLives ? colors.heart : colors.border }]}>♥</Text>
      ))}
      {onBuyLife && (
        <TouchableOpacity
          style={[styles.buyBtn, { borderColor: canAfford ? colors.diamond : colors.border, opacity: canAfford ? 1 : 0.5 }]}
          onPress={canAfford ? onBuyLife : undefined}
          activeOpacity={0.7}
        >
          <Text style={[styles.buyText, { color: colors.diamond }]}>+♥ {COST}💎</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heart: { fontSize: 20 },
  buyBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 6 },
  buyText: { fontSize: 11, fontWeight: '700' },
});
