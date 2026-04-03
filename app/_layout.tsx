import { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '@/theme/ThemeContext';
import { useAuthStore } from '@/auth/authStore';
import { getMe } from '@/api/user';
import { mergePlayedGames } from '@/storage/playedGames';
import { getCompletedPuzzles } from '@/api/puzzles';
import { claimReferral } from '@/api/referral';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AppNavigator() {
  const { setAuth, jwt } = useAuthStore();

  // Restore session on launch
  useEffect(() => {
    AsyncStorage.getItem('jwt').then(async (storedJwt) => {
      if (!storedJwt) return;
      try {
        const profile = await getMe();
        setAuth({
          id: profile.id,
          displayName: profile.displayName,
          avatarUrl: profile.avatarUrl,
          diamonds: profile.diamonds,
          currentStreak: profile.currentStreak,
        }, storedJwt);
        // Sync completed puzzles
        const serverIds = await getCompletedPuzzles();
        await mergePlayedGames(serverIds);
      } catch {
        AsyncStorage.removeItem('jwt'); // token expired
      }
    });
  }, []);

  // Capture referral deep link
  useEffect(() => {
    const handleUrl = (url: string) => {
      const parsed = Linking.parse(url);
      if (parsed.path === 'invite' && parsed.queryParams?.ref) {
        AsyncStorage.setItem('pending_referrer', parsed.queryParams.ref as string);
      }
    };

    Linking.getInitialURL().then(url => { if (url) handleUrl(url); });
    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
