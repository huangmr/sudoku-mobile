jest.mock('@react-native-async-storage/async-storage');

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../src/auth/authStore';

const mockUser = {
  id: 'user-1',
  displayName: 'Alice',
  avatarUrl: 'https://example.com/avatar.jpg',
  diamonds: 50,
  currentStreak: 3,
};

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  useAuthStore.setState({ user: null, jwt: null, isLoggedIn: false });
});

describe('setAuth', () => {
  test('sets user, jwt, and isLoggedIn', () => {
    useAuthStore.getState().setAuth(mockUser, 'jwt-token-123');
    const s = useAuthStore.getState();
    expect(s.user).toEqual(mockUser);
    expect(s.jwt).toBe('jwt-token-123');
    expect(s.isLoggedIn).toBe(true);
  });

  test('persists jwt to AsyncStorage', () => {
    useAuthStore.getState().setAuth(mockUser, 'jwt-abc');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('jwt', 'jwt-abc');
  });
});

describe('logout', () => {
  test('clears user, jwt, and isLoggedIn', () => {
    useAuthStore.getState().setAuth(mockUser, 'jwt-token');
    useAuthStore.getState().logout();
    const s = useAuthStore.getState();
    expect(s.user).toBeNull();
    expect(s.jwt).toBeNull();
    expect(s.isLoggedIn).toBe(false);
  });

  test('removes jwt from AsyncStorage', () => {
    useAuthStore.getState().logout();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('jwt');
  });
});

describe('updateUser', () => {
  test('merges partial user fields', () => {
    useAuthStore.getState().setAuth(mockUser, 'jwt');
    useAuthStore.getState().updateUser({ diamonds: 100 });
    expect(useAuthStore.getState().user?.diamonds).toBe(100);
    expect(useAuthStore.getState().user?.displayName).toBe('Alice');
  });

  test('updates multiple fields at once', () => {
    useAuthStore.getState().setAuth(mockUser, 'jwt');
    useAuthStore.getState().updateUser({ diamonds: 200, currentStreak: 10 });
    const u = useAuthStore.getState().user;
    expect(u?.diamonds).toBe(200);
    expect(u?.currentStreak).toBe(10);
  });

  test('does nothing when user is null', () => {
    useAuthStore.getState().updateUser({ diamonds: 99 });
    expect(useAuthStore.getState().user).toBeNull();
  });
});
