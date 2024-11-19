import { create } from 'zustand';
import { AuthState, User, UserRole } from '../core/types/auth';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      const mockUser: User = {
        id: '1',
        username: 'demo',
        email,
        role: UserRole.USER,
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          theme: 'dark',
          editorSettings: {
            fontSize: 14,
            fontFamily: 'Fira Code',
            tabSize: 2,
            useSoftTabs: true,
            showLineNumbers: true,
            enableAutoComplete: true,
            enableLivePreview: true,
            theme: 'monokai'
          },
          recentFiles: [],
          autoSave: false,
          livePreview: true
        }
      };
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // TODO: Replace with actual API call
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      const mockUser: User = {
        id: '1',
        username,
        email,
        role: UserRole.USER,
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          theme: 'dark',
          editorSettings: {
            fontSize: 14,
            fontFamily: 'Fira Code',
            tabSize: 2,
            useSoftTabs: true,
            showLineNumbers: true,
            enableAutoComplete: true,
            enableLivePreview: true,
            theme: 'monokai'
          },
          recentFiles: [],
          autoSave: false,
          livePreview: true
        }
      };
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateUser: async (userData: Partial<User>) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      set(state => ({
        user: state.user ? { ...state.user, ...userData } : null,
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));
