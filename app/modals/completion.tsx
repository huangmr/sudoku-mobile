import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ThemedBackground } from '@/components/ThemedBackground';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/theme/ThemeContext';
import { Level } from '@/puzzle/difficulty';
import { RewardPopup, RewardReason } from '@/components/RewardPopup';

export default function CompletionModal() {
  const { colors } = useTheme();
  const { score, time, level, puzzleId, rewardReason, rewardDiamonds } = useLocalSearchParams<{
    score: string; time: string; level: Level; puzzleId: string;
    rewardReason?: RewardReason; rewardDiamonds?: string;
  }>();

  const [rewardVisible, setRewardVisible] = useState(!!rewardReason);

  const seconds = parseInt(time, 10);
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
return (
    <ThemedBackground style={{ alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Text style={{ fontSize: 40, marginBottom: 8 }}>🎉</Text>
      <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 4 }}>Puzzle Complete!</Text>
      <Text style={{ fontSize: 36, fontWeight: '800', color: colors.primary, marginVertical: 12 }}>
        {parseInt(score, 10).toLocaleString()}
      </Text>
      <Text style={{ color: colors.textSecondary }}>Time: {mins}:{secs}</Text>

      <TouchableOpacity
        style={{ backgroundColor: colors.primary, borderRadius: 14, padding: 16, width: '100%', alignItems: 'center', marginTop: 32, marginBottom: 12 }}
        onPress={() => router.replace({ pathname: '/(tabs)/game', params: { level } })}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Next Puzzle</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: colors.border }}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={{ color: colors.text, fontSize: 16 }}>Go Home</Text>
      </TouchableOpacity>

      {rewardReason && (
        <RewardPopup
          visible={rewardVisible}
          reason={rewardReason}
          diamonds={parseInt(rewardDiamonds ?? '0', 10)}
          onClose={() => setRewardVisible(false)}
        />
      )}
    </ThemedBackground>
  );
}
