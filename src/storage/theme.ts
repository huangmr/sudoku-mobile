import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemePreference = "system" | "light" | "dark";

const KEY = "theme_preference";

export async function getThemePreference(): Promise<ThemePreference> {
  const value = await AsyncStorage.getItem(KEY);
  if (value === "light" || value === "dark" || value === "system") return value;
  return "system";
}

export async function setThemePreference(pref: ThemePreference): Promise<void> {
  await AsyncStorage.setItem(KEY, pref);
}
