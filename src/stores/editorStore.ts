import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserFileSystemService } from '../services/UserFileSystemService';
import { EditorFile, ProjectFile } from '../types/editor';
import { CreateFileRequest } from '../types/fileSystem';

interface EditorStore {
  files: EditorFile[];
  projectFiles: ProjectFile[];
  activeFile: EditorFile | null;
  openFiles: string[];
  recentFiles: string[];
  editorInstance: any;
  fileSystem: UserFileSystemService;
  setEditorInstance: (editor: any) => void;
  openFile: (fileId: string) => Promise<void>;
  closeFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  saveFile: (fileId: string) => Promise<void>;
  createFile: (parentPath: string, name: string, content?: string) => Promise<void>;
  createFolder: (parentPath: string, name: string) => Promise<void>;
  renameFile: (path: string, newName: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      files: [],
      projectFiles: [],
      activeFile: null,
      openFiles: [],
      recentFiles: [],
      editorInstance: null,
      fileSystem: UserFileSystemService.getInstance(),

      setEditorInstance: (editor) => set({ editorInstance: editor }),

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
            activeFile: file,
            recentFiles: [fileId, ...state.recentFiles.filter(id => id !== fileId)].slice(0, 10)
          }));
        } catch (error) {
          console.error('Failed to open file:', error);
        }
      },

      closeFile: (fileId) => {
        set(state => ({
          openFiles: state.openFiles.filter(id => id !== fileId),
          activeFile: state.activeFile?.id === fileId ? null : state.activeFile,
          recentFiles: state.recentFiles.filter(id => id !== fileId)
        }));
      },

      updateFileContent: (fileId, content) => {
        set(state => ({
          files: state.files.map(f =>
            f.id === fileId
              ? { ...f, content, isUnsaved: true }
              : f
          )
        }));
      },

      saveFile: async (fileId) => {
        const { files, fileSystem } = get();
        const file = files.find(f => f.id === fileId);
        if (!file) return;

        try {
          await fileSystem.updateFile(fileId, { content: file.content });
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

      createFile: async (parentPath, name, content = '') => {
        const { fileSystem } = get();
        try {
          const request: CreateFileRequest = {
            name,
            path: `${parentPath}/${name}`,
            type: 'text/plain',
            isDirectory: false,
            content
          };

          const response = await fileSystem.createFile(request);
          if (response.success && response.file) {
            set(state => ({
              files: [...state.files, { 
                ...response.file,
                isUnsaved: false,
                language: 'plaintext',
                lastModified: new Date()
              }],
              projectFiles: [...state.projectFiles, {
                ...response.file,
                isDirectory: false,
                content: '',
                language: 'plaintext',
                lastModified: new Date(),
                isUnsaved: false,
                children: []
              }]
            }));
          }
        } catch (error) {
          console.error('Failed to create file:', error);
          throw error;
        }
      },

      createFolder: async (parentPath, name) => {
        const { fileSystem } = get();
        try {
          const request: CreateFileRequest = {
            name,
            path: `${parentPath}/${name}`,
            type: 'directory',
            isDirectory: true,
            content: ''
          };

          const response = await fileSystem.createFile(request);
          if (response.success && response.file) {
            set(state => ({
              projectFiles: [...state.projectFiles, {
                ...response.file,
                isDirectory: true,
                content: '',
                language: 'plaintext',
                lastModified: new Date(),
                isUnsaved: false,
                children: []
              }]
            }));
          }
        } catch (error) {
          console.error('Failed to create folder:', error);
          throw error;
        }
      },

      renameFile: async (path, newName) => {
        // TODO: Implement file renaming
      },

      deleteFile: async (fileId) => {
        const { fileSystem } = get();
        try {
          await fileSystem.deleteFile(fileId);
          set(state => ({
            files: state.files.filter(f => f.id !== fileId),
            openFiles: state.openFiles.filter(id => id !== fileId),
            activeFile: state.activeFile?.id === fileId ? null : state.activeFile,
            projectFiles: state.projectFiles.filter(f => f.id !== fileId)
          }));
        } catch (error) {
          console.error('Failed to delete file:', error);
          throw error;
        }
      }
    }),
    {
      name: 'editor-storage',
      partialize: (state) => ({
        files: state.files,
        openFiles: state.openFiles,
        activeFile: state.activeFile,
        recentFiles: state.recentFiles
      })
    }
  )
);
