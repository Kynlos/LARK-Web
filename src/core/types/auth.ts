export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  editorSettings: {
    fontSize: number;
    fontFamily: string;
    tabSize: number;
    showLineNumbers: boolean;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  preferences: UserPreferences;
  bio?: string;
  profilePicture?: string;
  createdAt: Date;
  lastActive: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
  confirmPassword: string;
}
