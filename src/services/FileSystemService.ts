import { EditorFile, ProjectFile } from '../core/types/editor';

/**
 * Service for handling file system operations.
 * Uses the File System Access API for modern browsers.
 */
export class FileSystemService {
  private static instance: FileSystemService;
  private directoryHandle: FileSystemDirectoryHandle | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): FileSystemService {
    if (!FileSystemService.instance) {
      FileSystemService.instance = new FileSystemService();
    }
    return FileSystemService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.directoryHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
      });
      this.initialized = true;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // User cancelled the directory picker - this is fine
        console.log('User cancelled directory selection');
      } else {
        console.error('Failed to initialize FileSystemService:', error);
      }
      // Don't throw, just continue without filesystem access
      this.initialized = false;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async getDirectoryHandle(): Promise<FileSystemDirectoryHandle> {
    if (!this.directoryHandle) {
      await this.initialize();
      if (!this.directoryHandle) {
        throw new Error('No directory access. Please select a directory first.');
      }
    }
    return this.directoryHandle;
  }

  async createFile(path: string, content: string): Promise<void> {
    try {
      const handle = await this.getDirectoryHandle();
      const fileHandle = await handle.getFileHandle(path, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('Operation cancelled by user');
      } else {
        console.error('Failed to create file:', error);
        throw error;
      }
    }
  }

  async readFile(path: string): Promise<string> {
    try {
      const handle = await this.getDirectoryHandle();
      const fileHandle = await handle.getFileHandle(path);
      const file = await fileHandle.getFile();
      return await file.text();
    } catch (error) {
      console.error('Failed to read file:', error);
      throw error;
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const handle = await this.getDirectoryHandle();
      await handle.removeEntry(path);
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  async listFiles(): Promise<string[]> {
    try {
      const handle = await this.getDirectoryHandle();
      const files: string[] = [];
      for await (const [name] of handle.entries()) {
        files.push(name);
      }
      return files;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('Operation cancelled by user');
        return [];
      } else {
        console.error('Failed to list files:', error);
        throw error;
      }
    }
  }

  async requestProjectAccess(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }

    try {
      await this.initialize();
      return this.initialized;
    } catch (error) {
      console.error('Failed to get directory access:', error);
      return false;
    }
  }

  async readFileContent(path: string): Promise<EditorFile> {
    if (!this.initialized) {
      throw new Error('No project directory selected');
    }

    const content = await this.readFile(path);
    const language = this.getLanguageFromFileName(path);

    return {
      id: path,
      name: path,
      path,
      content,
      language,
      lastModified: new Date(),
      isUnsaved: false,
    };
  }

  async writeFile(path: string, content: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('No project directory selected');
    }

    await this.createFile(path, content);
  }

  async createFileInProject(path: string, name: string): Promise<EditorFile> {
    if (!this.initialized) {
      throw new Error('No project directory selected');
    }

    // Ensure the file has the correct extension
    const fileName = name.includes('.') ? name : `${name}.case`;
    
    await this.createFile(`${path}/${fileName}`, '');
    const file = await this.readFileContent(`${path}/${fileName}`);
    return file;
  }

  async createDirectoryInProject(path: string, name: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('No project directory selected');
    }

    const handle = await this.getDirectoryHandle();
    await handle.getDirectoryHandle(name, { create: true });
  }

  async deleteFileInProject(path: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('No project directory selected');
    }

    await this.deleteFile(path);
  }

  async renameFileInProject(oldPath: string, newName: string): Promise<string> {
    if (!this.initialized) {
      throw new Error('No project directory selected');
    }

    const parentPath = oldPath.substring(0, oldPath.lastIndexOf('/'));
    const oldName = oldPath.substring(oldPath.lastIndexOf('/') + 1);
    const newPath = `${parentPath}/${newName}`;

    await this.deleteFile(oldPath);
    await this.createFile(newPath, await this.readFile(oldPath));

    return newPath;
  }

  async getProjectFiles(): Promise<ProjectFile[]> {
    if (!this.initialized) {
      throw new Error('No project directory selected');
    }

    const files: ProjectFile[] = [];
    const fileNames = await this.listFiles();

    for (const fileName of fileNames) {
      const file = await this.readFileContent(fileName);
      files.push({
        id: fileName,
        name: fileName,
        path: '/',
        isDirectory: false,
        content: file.content,
        language: file.language,
        lastModified: file.lastModified,
        isUnsaved: file.isUnsaved,
      });
    }

    return files;
  }

  private getLanguageFromFileName(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
      case: 'casebook'
    };

    return languageMap[extension] || 'plaintext';
  }
}
