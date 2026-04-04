jest.mock('@react-native-async-storage/async-storage');

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGuestStreak, recordGuestPlay } from '../src/storage/guestStreak';

const TODAY = new Date().toISOString().split('T')[0];
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const YESTERDAY = yesterday.toISOString().split('T')[0];
const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const TWO_DAYS_AGO = twoDaysAgo.toISOString().split('T')[0];

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('getGuestStreak', () => {
  test('returns zero streak when no data', async () => {
    const data = await getGuestStreak();
    expect(data.currentStreak).toBe(0);
    expect(data.lastPlayedDate).toBeNull();
  });

  test('returns parsed data', async () => {
    await AsyncStorage.setItem('guest_streak', JSON.stringify({ currentStreak: 5, lastPlayedDate: TODAY }));
    const data = await getGuestStreak();
    expect(data.currentStreak).toBe(5);
    expect(data.lastPlayedDate).toBe(TODAY);
  });
});

describe('recordGuestPlay', () => {
  test('first play sets streak to 1', async () => {
    const result = await recordGuestPlay();
    expect(result.currentStreak).toBe(1);
    expect(result.lastPlayedDate).toBe(TODAY);
  });

  test('playing same day does not change streak', async () => {
    await AsyncStorage.setItem('guest_streak', JSON.stringify({ currentStreak: 3, lastPlayedDate: TODAY }));
    const result = await recordGuestPlay();
    expect(result.currentStreak).toBe(3);
  });

  test('playing on consecutive day increments streak', async () => {
    await AsyncStorage.setItem('guest_streak', JSON.stringify({ currentStreak: 3, lastPlayedDate: YESTERDAY }));
    const result = await recordGuestPlay();
    expect(result.currentStreak).toBe(4);
    expect(result.lastPlayedDate).toBe(TODAY);
  });

  test('missing a day resets streak to 1', async () => {
    await AsyncStorage.setItem('guest_streak', JSON.stringify({ currentStreak: 5, lastPlayedDate: TWO_DAYS_AGO }));
    const result = await recordGuestPlay();
    expect(result.currentStreak).toBe(1);
  });

  test('streak resets to 0 when it reaches 8 (over 7)', async () => {
    await AsyncStorage.setItem('guest_streak', JSON.stringify({ currentStreak: 7, lastPlayedDate: YESTERDAY }));
    const result = await recordGuestPlay();
    expect(result.currentStreak).toBe(0);
  });

  test('persists updated streak to storage', async () => {
    await recordGuestPlay();
    const stored = await getGuestStreak();
    expect(stored.currentStreak).toBe(1);
    expect(stored.lastPlayedDate).toBe(TODAY);
  });
});
