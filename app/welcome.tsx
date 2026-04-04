import { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ThemedBackground } from "@/components/ThemedBackground";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/theme/ThemeContext";
import { useFacebookAuth, extractFbToken } from "@/auth/facebook";
import { loginWithFacebook } from "@/api/auth";
import { getMe } from "@/api/user";
import { useAuthStore } from "@/auth/authStore";

const RULES = [
  {
    title: "Fill the Grid",
    body: "Complete the 9×9 grid so every row, column, and 3×3 box contains the digits 1–9.",
  },
  {
    title: "No Repeats",
    body: "Each digit can appear only once in every row, column, and 3×3 box.",
  },
  {
    title: "Use the Clues",
    body: "Some numbers are pre-filled. Use them as starting points to deduce the rest.",
  },
  {
    title: "Beat the Clock",
    body: "Each level has a time limit. Run out of time and you lose a life. Harder levels get more time.",
  },
  {
    title: "Watch Your Lives",
    body: "You have 5 lives per session. Lose one if time runs out. Buy extra lives with 💎 diamonds.",
  },
];

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const { setAuth } = useAuthStore();
  const { request, response, promptAsync } = useFacebookAuth();

  useEffect(() => {
    const token = extractFbToken(response);
    if (!token) return;
    (async () => {
      try {
        const { token: jwt } = await loginWithFacebook(token);
        const profile = await getMe();
        setAuth(
          {
            id: profile.id,
            displayName: profile.displayName,
            avatarUrl: profile.avatarUrl,
            diamonds: profile.diamonds,
            currentStreak: profile.currentStreak,
          },
          jwt,
        );
        await AsyncStorage.setItem("has_seen_welcome", "true");
        router.replace("/(tabs)");
      } catch (e) {
        console.error("Login failed", e);
      }
    })();
  }, [response, setAuth]);

  const playAsGuest = async () => {
    await AsyncStorage.setItem("has_seen_welcome", "true");
    router.replace("/(tabs)");
  };

  const s = StyleSheet.create({
    header: {
      paddingTop: 60,
      paddingHorizontal: 24,
      alignItems: "center",
      paddingBottom: 8,
    },
    title: {
      fontSize: 40,
      fontWeight: "800",
      color: colors.text,
      letterSpacing: -1,
    },
    subtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 6 },
    rulesSection: { paddingHorizontal: 24, marginTop: 28 },
    rulesTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 14,
    },
    rule: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    ruleTitle: { fontSize: 14, fontWeight: "700", color: colors.primary },
    ruleBody: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 3,
      lineHeight: 18,
    },
    buttons: { padding: 24, gap: 12 },
    fbButton: {
      backgroundColor: "#1877f2",
      borderRadius: 14,
      padding: 16,
      alignItems: "center",
    },
    fbText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    guestButton: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    guestText: { color: colors.text, fontSize: 16, fontWeight: "600" },
  });

  return (
    <ThemedBackground>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={s.header}>
          <Text style={s.title}>Sudoku</Text>
          <Text style={s.subtitle}>Train your mind, one puzzle at a time</Text>
        </View>
        <View style={s.rulesSection}>
          <Text style={s.rulesTitle}>How to Play</Text>
          {RULES.map((rule) => (
            <View key={rule.title} style={s.rule}>
              <Text style={s.ruleTitle}>{rule.title}</Text>
              <Text style={s.ruleBody}>{rule.body}</Text>
            </View>
          ))}
        </View>
        <View style={s.buttons}>
          <TouchableOpacity
            style={s.fbButton}
            disabled={!request}
            onPress={() => promptAsync()}
          >
            <Text style={s.fbText}>Continue with Facebook (with Rewards)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.guestButton} onPress={playAsGuest}>
            <Text style={s.guestText}>Play as Guest</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedBackground>
  );
}
