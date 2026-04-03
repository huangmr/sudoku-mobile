import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

export function DiamondBadge({ count }: { count: number }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.icon, { color: colors.diamond }]}>💎</Text>
      <Text style={[styles.count, { color: colors.text }]}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  icon: { fontSize: 14 },
  count: { fontSize: 14, fontWeight: '700' },
});
