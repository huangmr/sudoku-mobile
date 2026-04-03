import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, Colors } from './colors';
import { ThemePreference, getThemePreference, setThemePreference } from '@/storage/theme';

type ThemeContextValue = {
  colors: Colors;
  gradient: string[];
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  gradient: [lightColors.gradientTop, lightColors.gradientMid, lightColors.gradientBottom],
  isDark: false,
  preference: 'system',
  setPreference: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    getThemePreference().then(setPreferenceState);
  }, []);

  const isDark = preference === 'system'
    ? systemScheme === 'dark'
    : preference === 'dark';

  const colors = isDark ? darkColors : lightColors;
  const gradient = [colors.gradientTop, colors.gradientMid, colors.gradientBottom];

  const setPreference = (p: ThemePreference) => {
    setPreferenceState(p);
    setThemePreference(p);
  };

  return (
    <ThemeContext.Provider value={{ colors, gradient, isDark, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
