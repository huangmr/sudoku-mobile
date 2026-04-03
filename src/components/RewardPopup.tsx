import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

export type RewardReason = 'streak' | 'top_winner' | 'invitation';

type Props = {
  visible: boolean;
  reason: RewardReason;
  diamonds: number;
  onClose: () => void;
};

const REWARD_CONFIG: Record<RewardReason, { icon: string; title: string; subtitle: (d: number) => string }> = {
  streak: {
    icon: '🔥',
    title: 'Streak Reward!',
    subtitle: (d) => `You're on a roll! You earned ${d} 💎 for your daily streak.`,
  },
  top_winner: {
    icon: '🏆',
    title: 'Top Winner!',
    subtitle: (d) => `You made the leaderboard! You earned ${d} 💎 for finishing in the top 10.`,
  },
  invitation: {
    icon: '🎁',
    title: 'Referral Reward!',
    subtitle: (d) => `A friend joined using your invite! You earned ${d} 💎.`,
  },
};

export function RewardPopup({ visible, reason, diamonds, onClose }: Props) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(0)).current;
  const sparkle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0);
      sparkle.setValue(0);
      Animated.sequence([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }),
        Animated.timing(sparkle, { toValue: 1, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const cfg = REWARD_CONFIG[reason];

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
          { transform: [{ scale }] },
        ]}>
          {/* Decorative sparkles */}
          <Animated.Text style={[styles.sparkle, styles.sparkleTopLeft, { opacity: sparkle }]}>✨</Animated.Text>
          <Animated.Text style={[styles.sparkle, styles.sparkleTopRight, { opacity: sparkle }]}>✨</Animated.Text>
          <Animated.Text style={[styles.sparkle, styles.sparkleBottomLeft, { opacity: sparkle }]}>⭐</Animated.Text>
          <Animated.Text style={[styles.sparkle, styles.sparkleBottomRight, { opacity: sparkle }]}>⭐</Animated.Text>

          <Text style={styles.icon}>{cfg.icon}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{cfg.title}</Text>

          <View style={[styles.diamondBadge, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
            <Text style={[styles.diamondAmount, { color: colors.primary }]}>+{diamonds} 💎</Text>
          </View>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{cfg.subtitle(diamonds)}</Text>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>Awesome!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    overflow: 'visible',
  },
  icon: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
  diamondBadge: {
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16,
  },
  diamondAmount: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  btn: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  sparkle: { position: 'absolute', fontSize: 22 },
  sparkleTopLeft: { top: 12, left: 16 },
  sparkleTopRight: { top: 12, right: 16 },
  sparkleBottomLeft: { bottom: 80, left: 16 },
  sparkleBottomRight: { bottom: 80, right: 16 },
});
