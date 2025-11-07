import { create } from 'zustand';
import { User } from '@/services/auth.service';

// Default user for the application (no authentication needed)
const DEFAULT_USER: User = {
  _id: '123456789',
  name: 'Default User',
  email: 'default@asanaclone.com',
  avatar: null,
  role: 'user',
  workspaces: [],
  teams: [],
  preferences: {},
  onboarded: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

interface AuthState {
  user: User;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: DEFAULT_USER,
  isAuthenticated: true,
  isLoading: false,
  error: null,

  loadUser: async () => {
    set({
      user: DEFAULT_USER,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearError: () => set({ error: null }),
}));
