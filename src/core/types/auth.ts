export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  lastLogin: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  editorSettings: EditorSettings;
  recentFiles: string[];
  customKeybindings?: Record<string, string>;
  autoSave: boolean;
  livePreview: boolean;
}

export interface EditorSettings {
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  useSoftTabs: boolean;
  showLineNumbers: boolean;
  enableAutoComplete: boolean;
  enableLivePreview: boolean;
  theme: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
