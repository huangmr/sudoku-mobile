import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { ThemedBackground } from "@/components/ThemedBackground";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/theme/ThemeContext";
import { useAuthStore } from "@/auth/authStore";
import {
  getDailyLeaderboard,
  getAllTimeLeaderboard,
  LeaderboardEntry,
} from "@/api/leaderboard";

export default function LeaderboardScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const [tab, setTab] = useState<"daily" | "alltime">("daily");

  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", tab],
    queryFn: tab === "daily" ? getDailyLeaderboard : getAllTimeLeaderboard,
    staleTime: 60_000,
  });

  const s = StyleSheet.create({
    container: { flex: 1 },
    header: {
      paddingTop: Platform.OS === "ios" ? 60 : 24,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 16,
    },
    tabs: { flexDirection: "row", gap: 8, marginBottom: 16 },
    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      borderWidth: 1,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
    },
    rank: {
      width: 32,
      fontSize: 16,
      fontWeight: "700",
      color: colors.textSecondary,
    },
    name: { flex: 1, fontSize: 15, fontWeight: "600", color: colors.text },
    score: { fontSize: 15, fontWeight: "700", color: colors.primary },
  });

  const renderItem = ({ item }: { item: LeaderboardEntry }) => {
    const isSelf = item.userId === user?.id;
    const medal =
      item.rank === 1
        ? "🥇"
        : item.rank === 2
          ? "🥈"
          : item.rank === 3
            ? "🥉"
            : null;
    return (
      <View
        style={[
          s.row,
          {
            borderBottomColor: colors.border,
            backgroundColor: isSelf ? colors.primaryLight : "transparent",
          },
        ]}
      >
        <Text style={s.rank}>{medal ?? `#${item.rank}`}</Text>
        <Text style={s.name} numberOfLines={1}>
          {item.displayName}
          {isSelf ? " (you)" : ""}
        </Text>
        <Text style={s.score}>{item.score.toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <ThemedBackground style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>Leaderboard</Text>
        <View style={s.tabs}>
          {(["daily", "alltime"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                s.tab,
                {
                  borderColor: tab === t ? colors.primary : colors.border,
                  backgroundColor: tab === t ? colors.primary : "transparent",
                },
              ]}
              onPress={() => setTab(t)}
            >
              <Text
                style={{
                  color: tab === t ? "#fff" : colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                {t === "daily" ? "Today" : "All Time"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(i) => String(i.rank)}
          renderItem={renderItem}
        />
      )}
    </ThemedBackground>
  );
}
