import { create } from 'zustand';
import { UserFileSystemService } from '../services/UserFileSystemService';
import { UserFile, CreateFileRequest, UpdateFileRequest, DownloadOptions } from '../types/fileSystem';

interface FileSystemState {
  files: UserFile[];
  currentPath: string;
  isLoading: boolean;
  error: string | null;
  selectedFiles: Set<string>;
  
  // Actions
  setFiles: (files: UserFile[]) => void;
  setCurrentPath: (path: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  selectFile: (fileId: string) => void;
  unselectFile: (fileId: string) => void;
  clearSelection: () => void;
  
  // File Operations
  listFiles: (path?: string) => Promise<void>;
  createFile: (request: CreateFileRequest) => Promise<void>;
  updateFile: (fileId: string, request: UpdateFileRequest) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  shareFile: (fileId: string) => Promise<string>;
  unshareFile: (fileId: string) => Promise<void>;
  downloadFile: (fileId: string, options?: DownloadOptions) => Promise<void>;
  uploadFile: (path: string, file: File) => Promise<void>;
  moveFile: (fileId: string, newPath: string) => Promise<void>;
  copyFile: (fileId: string, newPath: string) => Promise<void>;
  exportUserFiles: () => Promise<void>;
  createDirectory: (path: string) => Promise<void>;
}

export const useFileSystemStore = create<FileSystemState>((set, get) => {
  const fileSystem = UserFileSystemService.getInstance();

  return {
    files: [],
    currentPath: '/',
    isLoading: false,
    error: null,
    selectedFiles: new Set(),

    setFiles: (files) => set({ files }),
    setCurrentPath: (path) => set({ currentPath: path }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    selectFile: (fileId) => set((state) => {
      const newSelection = new Set(state.selectedFiles);
      newSelection.add(fileId);
      return { selectedFiles: newSelection };
    }),
    unselectFile: (fileId) => set((state) => {
      const newSelection = new Set(state.selectedFiles);
      newSelection.delete(fileId);
      return { selectedFiles: newSelection };
    }),
    clearSelection: () => set({ selectedFiles: new Set() }),

    listFiles: async (path = '/') => {
      const { setLoading, setError, setFiles, setCurrentPath } = get();
      setLoading(true);
      try {
        const response = await fileSystem.listFiles(path);
        setFiles(response.files);
        setCurrentPath(path);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },

    createFile: async (request) => {
      const { setLoading, setError, listFiles, currentPath } = get();
      setLoading(true);
      try {
        await fileSystem.createFile(request);
        await listFiles(currentPath);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },

    updateFile: async (fileId, request) => {
      const { setLoading, setError, listFiles, currentPath } = get();
      setLoading(true);
      try {
        await fileSystem.updateFile(fileId, request);
        await listFiles(currentPath);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },

    deleteFile: async (fileId) => {
      const { setLoading, setError, listFiles, currentPath } = get();
      setLoading(true);
      try {
        await fileSystem.deleteFile(fileId);
        await listFiles(currentPath);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },

    shareFile: async (fileId) => {
      const { setLoading, setError } = get();
      setLoading(true);
      try {
        const response = await fileSystem.shareFile(fileId);
        setError(null);
        return response.publicUrl;
      } catch (error) {
        setError((error as Error).message);
        throw error;
      } finally {
        setLoading(false);
      }
    },

    unshareFile: async (fileId) => {
      const { setLoading, setError, listFiles, currentPath } = get();
      setLoading(true);
      try {
        await fileSystem.unshareFile(fileId);
        await listFiles(currentPath);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },

    downloadFile: async (fileId, options) => {
      const { setLoading, setError } = get();
      setLoading(true);
      try {
        const blob = await fileSystem.downloadFile(fileId, options);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'download'; // The actual filename will be set by the server
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },

    uploadFile: async (path, file) => {
      const { setLoading, setError, listFiles, currentPath } = get();
      setLoading(true);
      try {
        await fileSystem.uploadFile(path, file);
        await listFiles(currentPath);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },

    moveFile: async (fileId, newPath) => {
      const { setLoading, setError, listFiles, currentPath } = get();
      setLoading(true);
      try {
        await fileSystem.moveFile(fileId, newPath);
        await listFiles(currentPath);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },

    copyFile: async (fileId, newPath) => {
      const { setLoading, setError, listFiles, currentPath } = get();
      setLoading(true);
      try {
        await fileSystem.copyFile(fileId, newPath);
        await listFiles(currentPath);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },

    exportUserFiles: async () => {
      const { setLoading, setError } = get();
      setLoading(true);
      try {
        const blob = await fileSystem.exportUserFiles();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user_files.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },

    createDirectory: async (path) => {
      try {
        set({ isLoading: true, error: null });
        const fileSystem = UserFileSystemService.getInstance();
        await fileSystem.createDirectory(path);
        await get().listFiles(get().currentPath);
      } catch (error) {
        set({ error: 'Failed to create directory' });
        console.error('Failed to create directory:', error);
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
