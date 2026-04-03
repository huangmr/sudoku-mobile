import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  displayName: string;
  avatarUrl: string;
  diamonds: number;
  currentStreak: number;
};

type AuthState = {
  user: User | null;
  jwt: string | null;
  isLoggedIn: boolean;
  setAuth: (user: User, jwt: string) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  jwt: null,
  isLoggedIn: false,

  setAuth: (user, jwt) => {
    AsyncStorage.setItem('jwt', jwt);
    set({ user, jwt, isLoggedIn: true });
  },

  logout: () => {
    AsyncStorage.removeItem('jwt');
    set({ user: null, jwt: null, isLoggedIn: false });
  },

  updateUser: (partial) => set(s => ({
    user: s.user ? { ...s.user, ...partial } : s.user,
  })),
}));
