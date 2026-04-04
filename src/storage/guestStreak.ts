import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "guest_streak";

type StreakData = {
  currentStreak: number;
  lastPlayedDate: string | null; // ISO date string YYYY-MM-DD
};

function today(): string {
  return new Date().toISOString().split("T")[0];
}

export async function getGuestStreak(): Promise<StreakData> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return { currentStreak: 0, lastPlayedDate: null };
  return JSON.parse(raw);
}

export async function recordGuestPlay(): Promise<StreakData> {
  const data = await getGuestStreak();
  const todayStr = today();

  if (data.lastPlayedDate === todayStr) return data;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak =
    data.lastPlayedDate === yesterdayStr ? data.currentStreak + 1 : 1;

  if (newStreak > 7) newStreak = 0;

  const updated = { currentStreak: newStreak, lastPlayedDate: todayStr };
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
