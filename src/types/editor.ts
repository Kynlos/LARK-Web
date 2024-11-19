import { UserFile } from './fileSystem';

export interface EditorFile extends UserFile {
  isUnsaved: boolean;
  language: string;
  lastModified: Date;
}

export interface ProjectFile extends EditorFile {
  children?: ProjectFile[];
}

export interface EditorPosition {
  line: number;
  column: number;
}

export interface EditorSelection {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

export interface EditorViewState {
  scrollTop: number;
  scrollLeft: number;
  selection: EditorSelection[];
}

export interface EditorOptions {
  theme?: string;
  fontSize?: number;
  tabSize?: number;
  insertSpaces?: boolean;
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  lineNumbers?: 'on' | 'off' | 'relative';
  minimap?: {
    enabled: boolean;
    side?: 'right' | 'left';
  };
}
