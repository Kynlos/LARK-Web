import * as fs from 'fs/promises';
import * as path from 'path';
import { UserFile } from '../models/UserFile';

export class FileStorageService {
  private static instance: FileStorageService;
  private storageBasePath: string;

  private constructor() {
    // Store files in a 'storage' directory in the project root
    this.storageBasePath = path.join(process.cwd(), 'storage');
    this.ensureStorageDirectory();
  }

  public static getInstance(): FileStorageService {
    if (!FileStorageService.instance) {
      FileStorageService.instance = new FileStorageService();
    }
    return FileStorageService.instance;
  }

  private async ensureStorageDirectory() {
    try {
      await fs.access(this.storageBasePath);
    } catch {
      await fs.mkdir(this.storageBasePath, { recursive: true });
    }
  }

  private getUserStoragePath(userId: string): string {
    return path.join(this.storageBasePath, userId);
  }

  private async ensureUserDirectory(userId: string): Promise<void> {
    const userDir = this.getUserStoragePath(userId);
    try {
      await fs.access(userDir);
    } catch {
      await fs.mkdir(userDir, { recursive: true });
    }
  }

  async saveFile(file: UserFile, content: Buffer): Promise<void> {
    await this.ensureUserDirectory(file.userId);
    
    const filePath = path.join(
      this.getUserStoragePath(file.userId),
      file.path.replace(/^\/+/, ''),
      file.name
    );

    // Ensure the directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    // Write the file
    await fs.writeFile(filePath, content);
  }

  async readFile(file: UserFile): Promise<Buffer> {
    const filePath = path.join(
      this.getUserStoragePath(file.userId),
      file.path.replace(/^\/+/, ''),
      file.name
    );
    
    return await fs.readFile(filePath);
  }

  async deleteFile(file: UserFile): Promise<void> {
    const filePath = path.join(
      this.getUserStoragePath(file.userId),
      file.path.replace(/^\/+/, ''),
      file.name
    );
    
    await fs.unlink(filePath);
  }

  async moveFile(file: UserFile, newPath: string): Promise<void> {
    const oldPath = path.join(
      this.getUserStoragePath(file.userId),
      file.path.replace(/^\/+/, ''),
      file.name
    );
    
    const newFilePath = path.join(
      this.getUserStoragePath(file.userId),
      newPath.replace(/^\/+/, ''),
      file.name
    );

    // Ensure the target directory exists
    await fs.mkdir(path.dirname(newFilePath), { recursive: true });
    
    // Move the file
    await fs.rename(oldPath, newFilePath);
  }

  async copyFile(file: UserFile, newPath: string): Promise<void> {
    const sourcePath = path.join(
      this.getUserStoragePath(file.userId),
      file.path.replace(/^\/+/, ''),
      file.name
    );
    
    const targetPath = path.join(
      this.getUserStoragePath(file.userId),
      newPath.replace(/^\/+/, ''),
      file.name
    );

    // Ensure the target directory exists
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    
    // Copy the file
    await fs.copyFile(sourcePath, targetPath);
  }

  async createDirectory(userId: string, dirPath: string): Promise<void> {
    const fullPath = path.join(
      this.getUserStoragePath(userId),
      dirPath.replace(/^\/+/, '')
    );
    
    await fs.mkdir(fullPath, { recursive: true });
  }

  async deleteDirectory(userId: string, dirPath: string): Promise<void> {
    const fullPath = path.join(
      this.getUserStoragePath(userId),
      dirPath.replace(/^\/+/, '')
    );
    
    await fs.rm(fullPath, { recursive: true, force: true });
  }

  async listDirectory(userId: string, dirPath: string = ''): Promise<string[]> {
    const fullPath = path.join(
      this.getUserStoragePath(userId),
      dirPath.replace(/^\/+/, '')
    );
    
    try {
      return await fs.readdir(fullPath);
    } catch {
      return [];
    }
  }
}
