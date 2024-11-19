import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole, AuthState, LoginCredentials, RegisterCredentials } from '../core/types/auth';

const DEFAULT_USER_PREFERENCES = {
  theme: 'light' as const,
  editorSettings: {
    fontSize: 14,
    fontFamily: 'JetBrains Mono, monospace',
    tabSize: 2,
    showLineNumbers: true,
  },
};

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          if (!credentials?.email) {
            throw new Error('Email is required');
          }

          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          // In a real app, this would be an API response
          const user: User = {
            id: '1',
            username: credentials.email.split('@')[0],
            email: credentials.email,
            role: UserRole.USER,
            preferences: DEFAULT_USER_PREFERENCES,
            createdAt: new Date(),
            lastActive: new Date(),
          };

          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));

          // In a real app, this would be an API response
          const user: User = {
            id: '2',
            username: credentials.username,
            email: credentials.email,
            role: UserRole.USER,
            preferences: DEFAULT_USER_PREFERENCES,
            createdAt: new Date(),
            lastActive: new Date(),
          };

          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateUser: async (updatedUser: User) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));

          // In a real app, this would be an API call to update the user
          set(state => ({
            user: {
              ...state.user!,
              ...updatedUser,
              preferences: {
                ...state.user!.preferences,
                ...updatedUser.preferences,
              },
            },
          }));
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
