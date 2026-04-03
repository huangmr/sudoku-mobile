import { ScrollView, View, Text, StyleSheet, Platform } from 'react-native';
import { ThemedBackground } from '@/components/ThemedBackground';
import { useTheme } from '@/theme/ThemeContext';
import { useAuthStore } from '@/auth/authStore';
import { DiamondBadge } from '@/components/DiamondBadge';

const HOW_IT_WORKS = [
  {
    icon: '🔥',
    title: 'Daily Streak',
    desc: 'Play every day to build your streak. Earn +5 💎 per day, with a x2 bonus at 7-day streaks and x3 at 30 days.',
  },
  {
    icon: '🏆',
    title: 'Top Winners',
    desc: 'Finish in the top 10 on the daily leaderboard. #1 earns 100 💎, top 3 earn 50 💎, top 10 earn 20 💎.',
  },
  {
    icon: '🎁',
    title: 'Invite Friends',
    desc: 'Share your invite link. You earn 10 💎 when a friend plays their first game after signing up.',
  },
  {
    icon: '💎',
    title: 'Spend Diamonds',
    desc: 'Use diamonds to buy extra lives during a game (10 💎 per life). More ways to spend coming soon!',
  },
];

export default function RewardsScreen() {
  const { colors } = useTheme();
  const { isLoggedIn, user } = useAuthStore();

  const s = StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 24 },
    section: { paddingHorizontal: 20, marginBottom: 28 },
    heading: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 4 },
    subheading: { fontSize: 14, color: colors.textSecondary, marginBottom: 20 },
    sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
    balanceCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      gap: 8,
    },
    balanceLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
    balanceAmount: { fontSize: 48, fontWeight: '800', color: colors.primary },
    streakRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    streakText: { fontSize: 16, fontWeight: '700', color: colors.text },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      gap: 14,
      marginBottom: 10,
    },
    cardIcon: { fontSize: 28, lineHeight: 36 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 3 },
    cardDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
    loginPrompt: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      gap: 8,
    },
    loginPromptText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  });

  return (
    <ThemedBackground style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.section}>
          <Text style={s.heading}>Rewards</Text>
          <Text style={s.subheading}>Earn diamonds by playing, winning, and inviting friends.</Text>

          {isLoggedIn ? (
            <View style={s.balanceCard}>
              <Text style={s.balanceLabel}>Your Balance</Text>
              <Text style={s.balanceAmount}>{user?.diamonds ?? 0}</Text>
              <Text style={{ fontSize: 28 }}>💎</Text>
              {(user?.currentStreak ?? 0) > 0 && (
                <View style={s.streakRow}>
                  <Text style={{ fontSize: 20 }}>🔥</Text>
                  <Text style={s.streakText}>{user!.currentStreak}-day streak</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={s.loginPrompt}>
              <Text style={{ fontSize: 32 }}>💎</Text>
              <Text style={[s.loginPromptText, { fontWeight: '700', fontSize: 16, color: colors.text }]}>Sign in to earn rewards</Text>
              <Text style={s.loginPromptText}>Create an account to track your diamonds, streaks, and compete on the leaderboard.</Text>
            </View>
          )}
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>How to Earn</Text>
          {HOW_IT_WORKS.map(item => (
            <View key={item.title} style={s.card}>
              <Text style={s.cardIcon}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>{item.title}</Text>
                <Text style={s.cardDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedBackground>
  );
}
