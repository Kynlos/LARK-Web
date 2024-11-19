import { create } from 'zustand';
import { editor } from 'monaco-editor';
import { v4 as uuidv4 } from 'uuid';
import { EditorState, EditorFile, ProjectFile } from '../core/types/editor';
import { FileSystemService } from '../services/FileSystemService';

interface EditorStore extends EditorState {
  projectFiles: ProjectFile[];
  fileSystem: FileSystemService;
  setEditorInstance: (instance: editor.IStandaloneCodeEditor | null) => void;
  openFile: (fileId: string) => void;
  closeFile: (fileId: string) => void;
  switchToFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  saveFile: (fileId: string) => Promise<void>;
  saveAllFiles: () => Promise<void>;
  createFile: (parentPath: string, name: string, content?: string) => Promise<void>;
  createFolder: (parentPath: string, name: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  renameFile: (fileId: string, newName: string) => Promise<void>;
  isDirty: (fileId: string) => boolean;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  files: [],
  projectFiles: [],
  activeFile: null,
  openFiles: [],
  recentFiles: [],
  editorInstance: null,
  fileSystem: new FileSystemService(),

  setEditorInstance: (instance) => {
    set({ editorInstance: instance });
  },

  openFile: async (fileId) => {
    const { files, openFiles, fileSystem } = get();
    const existingFile = files.find(f => f.id === fileId);
    
    if (existingFile) {
      if (!openFiles.includes(fileId)) {
        set({ 
          openFiles: [...openFiles, fileId],
          activeFile: existingFile
        });
      } else {
        set({ activeFile: existingFile });
      }
      return;
    }

    try {
      const file = await fileSystem.readFile(fileId);
      set(state => ({
        files: [...state.files, file],
        openFiles: [...state.openFiles, fileId],
        activeFile: file
      }));
    } catch (error) {
      console.error('Failed to open file:', error);
    }
  },

  closeFile: (fileId) => {
    const { openFiles, activeFile } = get();
    const newOpenFiles = openFiles.filter(id => id !== fileId);
    
    set(state => ({
      openFiles: newOpenFiles,
      activeFile: activeFile?.id === fileId
        ? state.files.find(f => f.id === newOpenFiles[newOpenFiles.length - 1]) ?? null
        : activeFile
    }));
  },

  switchToFile: (fileId) => {
    const { files } = get();
    const file = files.find(f => f.id === fileId);
    if (file) {
      set({ activeFile: file });
    }
  },

  updateFileContent: (fileId, content) => {
    set(state => ({
      files: state.files.map(file =>
        file.id === fileId
          ? { ...file, content, isUnsaved: true }
          : file
      )
    }));
  },

  saveFile: async (fileId) => {
    const { files, fileSystem } = get();
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    try {
      await fileSystem.writeFile(file.path, file.content);
      set(state => ({
        files: state.files.map(f =>
          f.id === fileId
            ? { ...f, isUnsaved: false, lastModified: new Date() }
            : f
        )
      }));
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  },

  saveAllFiles: async () => {
    const { files } = get();
    const unsavedFiles = files.filter(f => f.isUnsaved);
    await Promise.all(unsavedFiles.map(file => get().saveFile(file.id)));
  },

  createFile: async (parentPath, name, content = '') => {
    const { fileSystem } = get();
    try {
      const newFile = await fileSystem.createFile(parentPath, name);
      if (content) {
        await fileSystem.writeFile(newFile.path, content);
      }

      set(state => ({
        files: [...state.files, { 
          ...newFile,
          content,
          isUnsaved: false,
          language: fileSystem.getLanguageFromFileName(name),
          lastModified: new Date()
        }],
        projectFiles: [...state.projectFiles, {
          ...newFile,
          isDirectory: false,
          content: '',
          language: fileSystem.getLanguageFromFileName(name),
          lastModified: new Date(),
          isUnsaved: false
        }]
      }));
    } catch (error) {
      console.error('Failed to create file:', error);
    }
  },

  createFolder: async (parentPath, name) => {
    const { fileSystem } = get();
    try {
      await fileSystem.createDirectory(parentPath, name);
      const newFolder: ProjectFile = {
        id: `${parentPath}/${name}`,
        name,
        path: parentPath,
        isDirectory: true,
        content: '',
        language: 'plaintext',
        lastModified: new Date(),
        isUnsaved: false,
        children: []
      };

      set(state => ({
        projectFiles: [...state.projectFiles, newFolder]
      }));
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  },

  deleteFile: async (fileId) => {
    const { files, fileSystem } = get();
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    try {
      await fileSystem.delete(file.path);
      set(state => ({
        files: state.files.filter(f => f.id !== fileId),
        openFiles: state.openFiles.filter(id => id !== fileId),
        activeFile: state.activeFile?.id === fileId ? null : state.activeFile,
        projectFiles: state.projectFiles.filter(f => f.id !== fileId)
      }));
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  },

  renameFile: async (fileId, newName) => {
    const { files, fileSystem } = get();
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    try {
      const newPath = await fileSystem.rename(file.path, newName);
      const newId = newPath;

      set(state => ({
        files: state.files.map(f =>
          f.id === fileId
            ? { ...f, id: newId, path: newPath, name: newName }
            : f
        ),
        openFiles: state.openFiles.map(id => id === fileId ? newId : id),
        activeFile: state.activeFile?.id === fileId
          ? { ...state.activeFile, id: newId, path: newPath, name: newName }
          : state.activeFile,
        projectFiles: state.projectFiles.map(f =>
          f.id === fileId
            ? { ...f, id: newId, path: newPath, name: newName }
            : f
        )
      }));
    } catch (error) {
      console.error('Failed to rename file:', error);
    }
  },

  isDirty: (fileId) => {
    const { files } = get();
    const file = files.find(f => f.id === fileId);
    return file?.isUnsaved ?? false;
  }
}));
