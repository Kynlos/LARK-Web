import { editor } from 'monaco-editor';

export interface EditorFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  lastModified: Date;
  isUnsaved: boolean;
}

export interface ProjectFile extends EditorFile {
  children?: ProjectFile[];
  isDirectory: boolean;
  size?: number;
  parentPath?: string;
}

export interface EditorState {
  files: EditorFile[];
  activeFile: EditorFile | null;
  openFiles: string[];  // Array of file IDs
  recentFiles: string[];  // Array of file IDs
  editorInstance: editor.IStandaloneCodeEditor | null;
}

export interface FileTreeItem {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileTreeItem[];
  size?: number;
}

export interface SearchResult {
  fileId: string;
  fileName: string;
  matches: {
    line: number;
    content: string;
    startColumn: number;
    endColumn: number;
  }[];
}

export interface EditorTheme {
  id: string;
  name: string;
  type: 'light' | 'dark';
  colors: Record<string, string>;
}

export interface EditorCommand {
  id: string;
  label: string;
  keybinding: number[];
  handler: () => void;
}

export interface EditorPlugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  initialize: (editor: editor.IStandaloneCodeEditor) => Promise<void>;
  cleanup?: () => Promise<void>;
  commands?: EditorCommand[];
  themes?: EditorTheme[];
  languages?: {
    id: string;
    extensions: string[];
    configuration: any;
  }[];
}
