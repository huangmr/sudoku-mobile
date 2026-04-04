import React from "react";
import { ImageBackground, View, StyleSheet } from "react-native";
import { useTheme } from "@/theme/ThemeContext";

import oceanImage from "../../assets/ocean-bg.jpg";

/**
 * Full-screen ocean background with a translucent tint overlay so
 * content stays readable without the image being overwhelming.
 */
export function ThemedBackground({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  const { isDark } = useTheme();

  // Light: white wash keeps it airy; Dark: deep navy tint deepens the ocean mood
  const overlayColor = isDark ? "rgba(5,20,40,0.60)" : "rgba(240,250,255,0.52)";

  return (
    <ImageBackground source={oceanImage} style={styles.bg} resizeMode="cover">
      <View style={[styles.overlay, { backgroundColor: overlayColor }, style]}>
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1 },
});
