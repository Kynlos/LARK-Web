import { EditorFile, ProjectFile } from '../core/types/editor';

/**
 * Service for handling file system operations.
 * Uses the File System Access API for modern browsers.
 */
export class FileSystemService {
  private fileHandles: Map<string, FileSystemFileHandle> = new Map();
  private rootDirectoryHandle: FileSystemDirectoryHandle | null = null;
  private pickerActive = false;

  /**
   * Request permission to access the project directory
   */
  async requestProjectAccess(): Promise<boolean> {
    if (this.pickerActive) {
      return false;
    }

    try {
      this.pickerActive = true;
      const dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
      });
      this.rootDirectoryHandle = dirHandle;
      return true;
    } catch (error) {
      console.error('Failed to get directory access:', error);
      return false;
    } finally {
      this.pickerActive = false;
    }
  }

  /**
   * Read a file's content
   */
  async readFile(path: string): Promise<EditorFile> {
    if (!this.rootDirectoryHandle) {
      throw new Error('No project directory selected');
    }

    const { handle, name } = await this.getFileHandle(path);
    const file = await handle.getFile();
    const content = await file.text();
    const language = this.getLanguageFromFileName(name);

    return {
      id: path,
      name,
      path,
      content,
      language,
      lastModified: new Date(file.lastModified),
      isUnsaved: false,
    };
  }

  /**
   * Write content to a file
   */
  async writeFile(path: string, content: string): Promise<void> {
    if (!this.rootDirectoryHandle) {
      throw new Error('No project directory selected');
    }

    const { handle } = await this.getFileHandle(path, true);
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
  }

  /**
   * Create a new file
   */
  async createFile(path: string, name: string): Promise<EditorFile> {
    if (!this.rootDirectoryHandle) {
      throw new Error('No project directory selected');
    }

    const dirHandle = await this.getDirectoryHandle(path);
    const fileHandle = await dirHandle.getFileHandle(name, { create: true });
    const file = await fileHandle.getFile();
    const language = this.getLanguageFromFileName(name);

    return {
      id: `${path}/${name}`,
      name,
      path,
      content: '',
      language,
      lastModified: new Date(file.lastModified),
      isUnsaved: false,
    };
  }

  /**
   * Create a new directory
   */
  async createDirectory(path: string, name: string): Promise<void> {
    if (!this.rootDirectoryHandle) {
      throw new Error('No project directory selected');
    }

    const dirHandle = await this.getDirectoryHandle(path);
    await dirHandle.getDirectoryHandle(name, { create: true });
  }

  /**
   * Delete a file or directory
   */
  async delete(path: string): Promise<void> {
    if (!this.rootDirectoryHandle) {
      throw new Error('No project directory selected');
    }

    const parentPath = path.substring(0, path.lastIndexOf('/'));
    const name = path.substring(path.lastIndexOf('/') + 1);
    const dirHandle = await this.getDirectoryHandle(parentPath);
    await dirHandle.removeEntry(name, { recursive: true });
  }

  /**
   * Rename a file or directory
   */
  async rename(oldPath: string, newName: string): Promise<string> {
    if (!this.rootDirectoryHandle) {
      throw new Error('No project directory selected');
    }

    const parentPath = oldPath.substring(0, oldPath.lastIndexOf('/'));
    const oldName = oldPath.substring(oldPath.lastIndexOf('/') + 1);
    const dirHandle = await this.getDirectoryHandle(parentPath);

    // Read the old file
    const oldHandle = await dirHandle.getFileHandle(oldName);
    const file = await oldHandle.getFile();
    const content = await file.text();

    // Create the new file
    const newHandle = await dirHandle.getFileHandle(newName, { create: true });
    const writable = await newHandle.createWritable();
    await writable.write(content);
    await writable.close();

    // Delete the old file
    await dirHandle.removeEntry(oldName);

    return `${parentPath}/${newName}`;
  }

  /**
   * Get all files in the project
   */
  async getProjectFiles(): Promise<ProjectFile[]> {
    if (!this.rootDirectoryHandle) {
      throw new Error('No project directory selected');
    }

    return this.readDirectory(this.rootDirectoryHandle, '/');
  }

  /**
   * Read a directory recursively
   */
  private async readDirectory(
    dirHandle: FileSystemDirectoryHandle,
    path: string
  ): Promise<ProjectFile[]> {
    const files: ProjectFile[] = [];

    for await (const entry of dirHandle.values()) {
      const entryPath = `${path}/${entry.name}`;

      if (entry.kind === 'directory') {
        const dirEntry = entry as FileSystemDirectoryHandle;
        const children = await this.readDirectory(dirEntry, entryPath);
        files.push({
          id: entryPath,
          name: entry.name,
          path,
          isDirectory: true,
          children,
          content: '',
          language: 'plaintext',
          lastModified: new Date(),
          isUnsaved: false,
        });
      } else if (entry.kind === 'file') {
        const fileEntry = entry as FileSystemFileHandle;
        const file = await fileEntry.getFile();
        files.push({
          id: entryPath,
          name: entry.name,
          path,
          isDirectory: false,
          content: '',  // Don't load content until file is opened
          language: this.getLanguageFromFileName(entry.name),
          lastModified: new Date(file.lastModified),
          isUnsaved: false,
          size: file.size,
        });
      }
    }

    return files.sort((a, b) => {
      if (a.isDirectory === b.isDirectory) {
        return a.name.localeCompare(b.name);
      }
      return a.isDirectory ? -1 : 1;
    });
  }

  /**
   * Get a file handle from a path
   */
  private async getFileHandle(
    path: string,
    create = false
  ): Promise<{ handle: FileSystemFileHandle; name: string }> {
    if (!this.rootDirectoryHandle) {
      throw new Error('No project directory selected');
    }

    const parts = path.split('/').filter(Boolean);
    const fileName = parts.pop();

    if (!fileName) {
      throw new Error('Invalid path');
    }

    let currentHandle: FileSystemDirectoryHandle = this.rootDirectoryHandle;

    // Navigate to the directory containing the file
    for (const part of parts) {
      currentHandle = await currentHandle.getDirectoryHandle(part);
    }

    // Get the file handle
    const fileHandle = await currentHandle.getFileHandle(fileName, { create });
    return { handle: fileHandle, name: fileName };
  }

  /**
   * Get a directory handle from a path
   */
  private async getDirectoryHandle(path: string): Promise<FileSystemDirectoryHandle> {
    if (!this.rootDirectoryHandle) {
      throw new Error('No project directory selected');
    }

    if (path === '/') {
      return this.rootDirectoryHandle;
    }

    const parts = path.split('/').filter(Boolean);
    let currentHandle: FileSystemDirectoryHandle = this.rootDirectoryHandle;

    for (const part of parts) {
      currentHandle = await currentHandle.getDirectoryHandle(part);
    }

    return currentHandle;
  }

  /**
   * Get the language from a file name
   */
  getLanguageFromFileName(fileName: string): string {
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
