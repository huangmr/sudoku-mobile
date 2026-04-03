import { useEffect } from 'react';
import { View, Text, TouchableOpacity, Share, Platform, StyleSheet, Alert } from 'react-native';
import { ThemedBackground } from '@/components/ThemedBackground';
import { router } from 'expo-router';
import { useTheme } from '@/theme/ThemeContext';
import { useAuthStore } from '@/auth/authStore';
import { DiamondBadge } from '@/components/DiamondBadge';
import { ThemePreference } from '@/storage/theme';
import { getInviteLink } from '@/api/referral';
import { useFacebookAuth, extractFbToken } from '@/auth/facebook';
import { loginWithFacebook } from '@/api/auth';
import { getMe } from '@/api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function ProfileScreen() {
  const { colors, preference, setPreference } = useTheme();
  const { isLoggedIn, user, logout, setAuth } = useAuthStore();
  const { response, promptAsync } = useFacebookAuth();

  useEffect(() => {
    const token = extractFbToken(response);
    if (!token) return;
    (async () => {
      try {
        const { token: jwt } = await loginWithFacebook(token);
        const profile = await getMe();
        setAuth({
          id: profile.id,
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
          diamonds: profile.diamonds,
          currentStreak: profile.currentStreak,
        }, jwt);
        await AsyncStorage.setItem('has_seen_welcome', 'true');
      } catch {
        Alert.alert('Login failed', 'Could not connect with Facebook.');
      }
    })();
  }, [response]);

  async function handleInvite() {
    try {
      const links = await getInviteLink();
      await Share.share({
        message: `I'm playing Sudoku! Join me → ${links.appStoreUrl}`,
        url: links.deepLink,
      });
    } catch {
      Alert.alert('Could not generate invite link');
    }
  }

  const s = StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'ios' ? 60 : 24 },
    section: { paddingHorizontal: 20, marginBottom: 32 },
    sectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
    card: { backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border },
    displayName: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4 },
    themeRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
    themeBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', borderWidth: 1 },
    btn: { borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
    fbBtn: { backgroundColor: '#1877f2', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 8 },
  });

  return (
    <ThemedBackground style={s.container}>
      <View style={s.section}>
        <Text style={s.sectionTitle}>Account</Text>
        <View style={s.card}>
          {isLoggedIn ? (
            <>
              <Text style={s.displayName}>{user?.displayName}</Text>
              <DiamondBadge count={user?.diamonds ?? 0} />
            </>
          ) : (
            <>
              <Text style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 12 }}>
                Sign in to save progress, earn rewards, and climb the leaderboard.
              </Text>
              <TouchableOpacity style={s.fbBtn} onPress={() => promptAsync()}>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
                  Continue with Facebook (with Rewards)
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Theme</Text>
        <View style={s.themeRow}>
          {THEME_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[s.themeBtn, {
                borderColor: preference === opt.value ? colors.primary : colors.border,
                backgroundColor: preference === opt.value ? colors.primary : 'transparent',
              }]}
              onPress={() => setPreference(opt.value)}
            >
              <Text style={{ color: preference === opt.value ? '#fff' : colors.textSecondary, fontWeight: '600' }}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoggedIn && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Social</Text>
          <TouchableOpacity style={[s.btn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]} onPress={handleInvite}>
            <Text style={{ color: colors.text, fontSize: 15, fontWeight: '600' }}>Invite Friends 🎁 +10 💎</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginTop: 12 }]} onPress={logout}>
            <Text style={{ color: '#ef5350', fontSize: 15, fontWeight: '600' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </ThemedBackground>
  );
}
