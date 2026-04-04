import React, { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "@/theme/ThemeContext";
import { useGameStore } from "@/game/gameStore";

export function Timer() {
  const { colors } = useTheme();
  const { elapsedSeconds, timeLimit, tickTimer, status } = useGameStore();

  useEffect(() => {
    if (status !== "playing") return;
    const interval = setInterval(tickTimer, 1000);
    return () => clearInterval(interval);
  }, [status, tickTimer]);

  const remaining = Math.max(0, timeLimit - elapsedSeconds);
  const mins = String(Math.floor(remaining / 60)).padStart(2, "0");
  const secs = String(remaining % 60).padStart(2, "0");

  const pct = timeLimit > 0 ? remaining / timeLimit : 1;
  const urgent = pct <= 0.1;

  return (
    <Text style={[styles.text, { color: urgent ? "#ef5350" : colors.text }]}>
      {mins}:{secs}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 20, fontWeight: "600", fontVariant: ["tabular-nums"] },
});
