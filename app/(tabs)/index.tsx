import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { ThemedBackground } from "@/components/ThemedBackground";
import { router } from "expo-router";
import { useTheme } from "@/theme/ThemeContext";
import { useAuthStore } from "@/auth/authStore";
import { DiamondBadge } from "@/components/DiamondBadge";
import { Level } from "@/puzzle/difficulty";

const LEVELS: { key: Level; label: string; emoji: string; desc: string }[] = [
  { key: "easy", label: "Easy", emoji: "🌱", desc: "35 clues • Relaxed pace" },
  {
    key: "medium",
    label: "Medium",
    emoji: "🔥",
    desc: "27 clues • Steady challenge",
  },
  {
    key: "hard",
    label: "Hard",
    emoji: "⚡",
    desc: "22 clues • Serious thinking",
  },
  {
    key: "horror",
    label: "Horror",
    emoji: "💀",
    desc: "17 clues • Expert only",
  },
];

export default function HomeScreen() {
  const { colors } = useTheme();
  const { isLoggedIn, user } = useAuthStore();

  const s = StyleSheet.create({
    header: {
      paddingTop: Platform.OS === "ios" ? 60 : 24,
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    greeting: { fontSize: 24, fontWeight: "800", color: colors.text },
    statsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginTop: 8,
    },
    streak: { color: colors.textSecondary, fontSize: 14 },
    section: { paddingHorizontal: 20, marginTop: 8 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textSecondary,
      marginBottom: 12,
    },
    levelBtn: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    levelEmoji: { fontSize: 24 },
    levelLabel: { fontSize: 17, fontWeight: "700", color: colors.text },
    levelDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  });

  return (
    <ThemedBackground>
      <View style={s.header}>
        <Text style={s.greeting}>
          {isLoggedIn ? `Hello, ${user?.displayName?.split(" ")[0]}` : "Sudoku"}
        </Text>
        <View style={s.statsRow}>
          {isLoggedIn && <DiamondBadge count={user?.diamonds ?? 0} />}
          {isLoggedIn && user?.currentStreak ? (
            <Text style={s.streak}>🔥 {user.currentStreak}-day streak</Text>
          ) : null}
        </View>
      </View>
      <View style={s.section}>
        <Text style={s.sectionTitle}>Choose a Level</Text>
        {LEVELS.map(({ key, label, emoji, desc }) => (
          <TouchableOpacity
            key={key}
            style={s.levelBtn}
            onPress={() =>
              router.push({ pathname: "/(tabs)/game", params: { level: key } })
            }
          >
            <Text style={s.levelEmoji}>{emoji}</Text>
            <View>
              <Text style={s.levelLabel}>{label}</Text>
              <Text style={s.levelDesc}>{desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ThemedBackground>
  );
}
