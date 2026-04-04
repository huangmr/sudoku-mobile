jest.mock('@/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import { apiClient } from '@/api/client';
import { loginWithFacebook } from '@/api/auth';
import { getMe } from '@/api/user';
import { submitScore } from '@/api/scores';
import { getDailyLeaderboard, getAllTimeLeaderboard } from '@/api/leaderboard';
import { registerPushToken } from '@/api/devices';
import { getCompletedPuzzles, markPuzzleCompleted } from '@/api/puzzles';
import { getInviteLink, claimReferral } from '@/api/referral';

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('loginWithFacebook', () => {
  test('posts to /auth/facebook and returns token', async () => {
    mockPost.mockResolvedValue({ data: { token: 'jwt-abc' } });
    const result = await loginWithFacebook('fb-access-token');
    expect(mockPost).toHaveBeenCalledWith('/auth/facebook', { accessToken: 'fb-access-token' });
    expect(result).toEqual({ token: 'jwt-abc' });
  });
});

describe('getMe', () => {
  test('gets /users/me and returns profile', async () => {
    const profile = { id: '1', displayName: 'Alice', avatarUrl: '', diamonds: 10, currentStreak: 3, longestStreak: 5 };
    mockGet.mockResolvedValue({ data: profile });
    const result = await getMe();
    expect(mockGet).toHaveBeenCalledWith('/users/me');
    expect(result).toEqual(profile);
  });
});

describe('submitScore', () => {
  test('posts to /scores and returns response data', async () => {
    const payload = { puzzleId: '1.1', level: 1, finalScore: 2000, timeTakenSeconds: 300, mistakes: 1 };
    mockPost.mockResolvedValue({ data: { scoreId: 'score-1', currentStreak: 2, diamonds: 50 } });
    const result = await submitScore(payload);
    expect(mockPost).toHaveBeenCalledWith('/scores', payload);
    expect(result.scoreId).toBe('score-1');
  });
});

describe('getDailyLeaderboard', () => {
  test('gets /leaderboard/daily', async () => {
    mockGet.mockResolvedValue({ data: [] });
    await getDailyLeaderboard();
    expect(mockGet).toHaveBeenCalledWith('/leaderboard/daily');
  });
});

describe('getAllTimeLeaderboard', () => {
  test('gets /leaderboard/alltime', async () => {
    mockGet.mockResolvedValue({ data: [] });
    await getAllTimeLeaderboard();
    expect(mockGet).toHaveBeenCalledWith('/leaderboard/alltime');
  });
});

describe('registerPushToken', () => {
  test('posts to /devices/token', async () => {
    mockPost.mockResolvedValue({ data: {} });
    await registerPushToken('ExponentPushToken[xxx]', 'ios', -480);
    expect(mockPost).toHaveBeenCalledWith('/devices/token', {
      pushToken: 'ExponentPushToken[xxx]',
      platform: 'ios',
      timezoneOffsetMinutes: -480,
    });
  });
});

describe('getCompletedPuzzles', () => {
  test('gets /puzzles/completed', async () => {
    mockGet.mockResolvedValue({ data: ['1.1', '1.2'] });
    const result = await getCompletedPuzzles();
    expect(mockGet).toHaveBeenCalledWith('/puzzles/completed');
    expect(result).toEqual(['1.1', '1.2']);
  });
});

describe('markPuzzleCompleted', () => {
  test('posts to /puzzles/completed', async () => {
    mockPost.mockResolvedValue({ data: {} });
    await markPuzzleCompleted('2.5');
    expect(mockPost).toHaveBeenCalledWith('/puzzles/completed', { puzzleId: '2.5' });
  });
});

describe('getInviteLink', () => {
  test('gets /invite/link', async () => {
    const link = { deepLink: 'sudoku://invite?ref=1', appStoreUrl: 'https://apps.apple.com', playStoreUrl: 'https://play.google.com' };
    mockGet.mockResolvedValue({ data: link });
    const result = await getInviteLink();
    expect(mockGet).toHaveBeenCalledWith('/invite/link');
    expect(result).toEqual(link);
  });
});

describe('claimReferral', () => {
  test('posts to /invite/claim', async () => {
    mockPost.mockResolvedValue({ data: { alreadyClaimed: false } });
    const result = await claimReferral('referrer-uuid');
    expect(mockPost).toHaveBeenCalledWith('/invite/claim', { referrerId: 'referrer-uuid' });
    expect(result.alreadyClaimed).toBe(false);
  });
});
