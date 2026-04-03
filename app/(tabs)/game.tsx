import { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, TextInput, AppState, Alert
} from 'react-native';
import { ThemedBackground } from '@/components/ThemedBackground';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/theme/ThemeContext';
import { useGameStore } from '@/game/gameStore';
import { useAuthStore } from '@/auth/authStore';
import { SudokuBoard } from '@/components/SudokuBoard';
import { NumberPad } from '@/components/NumberPad';
import { Timer } from '@/components/Timer';
import { TimerBar } from '@/components/TimerBar';
import { LivesDisplay } from '@/components/LivesDisplay';
import { generatePuzzle } from '@/puzzle/generator';
import { Level, LEVEL_CONFIG, levelFromCode } from '@/puzzle/difficulty';
import { calculateScore } from '@/game/scoring';
import { markGamePlayed, getPlayedGames } from '@/storage/playedGames';
import { recordGuestPlay } from '@/storage/guestStreak';
import { submitScore } from '@/api/scores';
import { markPuzzleCompleted } from '@/api/puzzles';
import { claimReferral } from '@/api/referral';
import { registerForPushNotifications } from '@/notifications/setup';
import { useKeyboardInput } from '@/game/useKeyboardInput';
import { RewardReason } from '@/components/RewardPopup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIFE_COST = 10; // diamonds

export default function GameScreen() {
  const { colors } = useTheme();
  const { level: levelParam, puzzleId: puzzleIdParam } = useLocalSearchParams<{
    level?: string; puzzleId?: string;
  }>();
  const { puzzle, status, elapsedSeconds, mistakes, startGame, pause, resume, reset, addLife } = useGameStore();
  const appStateRef = useRef(AppState.currentState);
  const { isLoggedIn, user, updateUser } = useAuthStore();
  const handledCompletion = useRef(false);
  const { inputRef, onNativeKeyPress } = useKeyboardInput();

  useEffect(() => {
    loadPuzzle();
    return () => reset();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      const prev = appStateRef.current;
      appStateRef.current = nextState;
      if (nextState === 'background' || nextState === 'inactive') {
        pause();
      } else if (nextState === 'active' && (prev === 'background' || prev === 'inactive')) {
        resume();
      }
    });
    return () => sub.remove();
  }, [pause, resume]);

  useEffect(() => {
    if (status === 'completed' && !handledCompletion.current) {
      handledCompletion.current = true;
      handleCompletion();
    }
  }, [status]);

  async function loadPuzzle() {
    const level: Level = (levelParam as Level) ?? 'easy';
    const played = await getPlayedGames();
    let index = puzzleIdParam
      ? parseInt(puzzleIdParam.split('.')[1], 10)
      : 1;

    while (played.has(`${LEVEL_CONFIG[level].code}.${index}`)) index++;
    const pid = `${LEVEL_CONFIG[level].code}.${index}`;
    const p = generatePuzzle(pid, level);
    startGame(p);
  }

  async function handleCompletion() {
    if (!puzzle) return;
    const level = puzzle.level;
    const score = calculateScore(level, elapsedSeconds, mistakes);

    await markGamePlayed(puzzle.puzzleId);

    const alreadyAsked = await AsyncStorage.getItem('push_asked');
    if (!alreadyAsked) {
      await AsyncStorage.setItem('push_asked', 'true');
      await registerForPushNotifications(isLoggedIn);
    }

    let rewardReason: RewardReason | undefined;
    let rewardDiamonds = 0;

    if (isLoggedIn) {
      try {
        const prevStreak = user?.currentStreak ?? 0;
        const result = await submitScore({
          puzzleId: puzzle.puzzleId,
          level: LEVEL_CONFIG[level].code,
          finalScore: score,
          timeTakenSeconds: elapsedSeconds,
          mistakes,
        });
        await markPuzzleCompleted(puzzle.puzzleId);
        updateUser({ diamonds: result.diamonds, currentStreak: result.currentStreak });

        // Streak reward detection
        if (result.currentStreak > prevStreak && result.currentStreak > 0) {
          const streakBonus = result.currentStreak >= 30 ? 15 : result.currentStreak >= 7 ? 10 : 5;
          rewardReason = 'streak';
          rewardDiamonds = streakBonus;
        }

        // Referral reward detection
        const pendingRef = await AsyncStorage.getItem('pending_referrer');
        if (pendingRef) {
          await claimReferral(pendingRef).catch(() => {});
          await AsyncStorage.removeItem('pending_referrer');
          if (!rewardReason) {
            rewardReason = 'invitation';
            rewardDiamonds = 10;
          }
        }
      } catch (e) {
        console.error('Score submission failed', e);
      }
    } else {
      await recordGuestPlay();
    }

    router.push({
      pathname: '/modals/completion',
      params: {
        score: String(score),
        time: String(elapsedSeconds),
        level,
        puzzleId: puzzle.puzzleId,
        ...(rewardReason ? { rewardReason, rewardDiamonds: String(rewardDiamonds) } : {}),
      },
    });
  }

  function handleBuyLife() {
    if (!isLoggedIn || (user?.diamonds ?? 0) < LIFE_COST) return;
    Alert.alert(
      'Buy a Life',
      `Spend ${LIFE_COST} 💎 to gain an extra life?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Buy (${LIFE_COST} 💎)`,
          onPress: () => {
            updateUser({ diamonds: (user!.diamonds) - LIFE_COST });
            addLife();
          },
        },
      ]
    );
  }

  const cellSelected = useGameStore(s => s.selectedCell) !== null;

  const s = StyleSheet.create({
    header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 20, paddingBottom: 8, gap: 16 },
    center: { flex: 1, justifyContent: 'center' },
    boardWrap: { paddingHorizontal: 8 },
    timerBarWrap: { paddingHorizontal: 8, paddingBottom: 6 },
  });

  if (status === 'gameover') {
    return (
      <GameOverScreen
        onRetry={() => { handledCompletion.current = false; puzzle && startGame(puzzle); }}
        onHome={() => { reset(); router.replace('/(tabs)'); }}
      />
    );
  }

  return (
    <ThemedBackground>
      <View style={s.header}>
        <LivesDisplay onBuyLife={isLoggedIn ? handleBuyLife : undefined} />
        <Timer />
      </View>
      <View style={s.timerBarWrap}>
        <TimerBar />
      </View>
      {Platform.OS !== 'web' && (
        <TextInput
          ref={inputRef}
          style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }}
          keyboardType="number-pad"
          caretHidden
          showSoftInputOnFocus={false}
          onKeyPress={({ nativeEvent }) => onNativeKeyPress(nativeEvent.key)}
        />
      )}
      <View style={s.center}>
        <View style={s.boardWrap}>
          {status !== 'paused' && <SudokuBoard />}
          {status === 'paused' && (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary, fontSize: 18 }}>Game Paused</Text>
            </View>
          )}
        </View>
        <NumberPad visible={cellSelected && status === 'playing'} />
      </View>
    </ThemedBackground>
  );
}

function GameOverScreen({ onRetry, onHome }: { onRetry: () => void; onHome: () => void }) {
  const { colors } = useTheme();
  const { elapsedSeconds, mistakes } = useGameStore();
  const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
  const secs = String(elapsedSeconds % 60).padStart(2, '0');

  return (
    <ThemedBackground style={{ alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <Text style={{ fontSize: 40, marginBottom: 8 }}>⏰</Text>
      <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 4 }}>Time's Up!</Text>
      <Text style={{ color: colors.textSecondary, marginBottom: 4 }}>Time: {mins}:{secs}</Text>
      <Text style={{ color: colors.textSecondary, marginBottom: 32 }}>Mistakes: {mistakes}</Text>
      <TouchableOpacity
        style={{ backgroundColor: colors.primary, borderRadius: 12, padding: 16, width: '100%', alignItems: 'center', marginBottom: 12 }}
        onPress={onRetry}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Try Again</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 16, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: colors.border }}
        onPress={onHome}
      >
        <Text style={{ color: colors.text, fontSize: 16 }}>Go Home</Text>
      </TouchableOpacity>
    </ThemedBackground>
  );
}
