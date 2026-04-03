import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'played_games';

export async function getPlayedGames(): Promise<Set<string>> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return new Set();
  return new Set(JSON.parse(raw) as string[]);
}

export async function markGamePlayed(puzzleId: string): Promise<void> {
  const played = await getPlayedGames();
  played.add(puzzleId);
  await AsyncStorage.setItem(KEY, JSON.stringify([...played]));
}

export async function mergePlayedGames(ids: string[]): Promise<void> {
  const played = await getPlayedGames();
  ids.forEach(id => played.add(id));
  await AsyncStorage.setItem(KEY, JSON.stringify([...played]));
}
