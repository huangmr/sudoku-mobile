import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { useGameStore } from '@/game/gameStore';

export function NumberPad({ visible }: { visible: boolean }) {
  const { colors } = useTheme();
  const { enterNumber, eraseCell, status } = useGameStore();
  const disabled = status !== 'playing';

  const s = StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: 8,
      paddingVertical: 12,
      opacity: visible ? 1 : 0,
    },
    key: {
      flex: 1,
      aspectRatio: 0.85,
      backgroundColor: colors.numberPad,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.numberPadBorder,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.4 : 1,
    },
    keyText: { fontSize: 18, fontWeight: '600', color: colors.text },
  });

  return (
    <View style={s.container} pointerEvents={visible ? 'auto' : 'none'}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
        <TouchableOpacity key={n} style={s.key} onPress={() => enterNumber(n)} disabled={disabled || !visible}>
          <Text style={s.keyText}>{n}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={s.key} onPress={eraseCell} disabled={disabled || !visible}>
        <Text style={s.keyText}>Del</Text>
      </TouchableOpacity>
    </View>
  );
}
