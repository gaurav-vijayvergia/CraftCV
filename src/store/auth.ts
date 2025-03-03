import { create } from 'zustand';
import { loginUser as apiLogin, signupUser as apiSignup, logout as apiLogout } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Demo credentials for fallback
const DEMO_USER = {
  id: 'demo-id',
  username: 'demo',
  email: 'demo@example.com',
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiLogin(username, password);
      set({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      // Fallback to demo login if API fails
      if (username === 'demo' && password === 'demo123') {
        localStorage.setItem('token', 'demo-token');
        set({
          user: DEMO_USER,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return;
      }

      set({
        error: 'Invalid username or password',
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      throw error;
    }
  },
  signup: async (username: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiSignup(username, email, password);
      set({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: 'Signup failed',
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      throw error;
    }
  },
  logout: () => {
    apiLogout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },
  clearError: () => set({ error: null }),
}));