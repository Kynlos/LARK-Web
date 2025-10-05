import axios from 'axios';
import { 
  UserFile, 
  CreateFileRequest, 
  UpdateFileRequest, 
  FileOperationResponse, 
  FileListResponse,
  FileShareResponse,
  DownloadOptions 
} from '../types/fileSystem';
import { mockFileSystem } from './MockFileSystemService';

export class UserFileSystemService {
  private static instance: UserFileSystemService;
  private baseUrl: string;
  private useMockApi: boolean;

  private constructor() {
    this.baseUrl = '/api/files';
    this.useMockApi = true; // Set to false when you have a real backend
  }

  static getInstance(): UserFileSystemService {
    if (!UserFileSystemService.instance) {
      UserFileSystemService.instance = new UserFileSystemService();
    }
    return UserFileSystemService.instance;
  }

  async listFiles(path: string = '/'): Promise<FileListResponse> {
    try {
      if (this.useMockApi) {
        return mockFileSystem.listFiles(path);
      }
      const response = await axios.get(`${this.baseUrl}?path=${encodeURIComponent(path)}`);
      return response.data;
    } catch (error) {
      console.error('Failed to list files:', error);
      throw error;
    }
  }

  async createFile(request: CreateFileRequest): Promise<FileOperationResponse> {
    try {
      if (this.useMockApi) {
        return mockFileSystem.createFile(request);
      }
      const response = await axios.post(this.baseUrl, request);
      return response.data;
    } catch (error) {
      console.error('Failed to create file:', error);
      throw error;
    }
  }

  async readFile(fileId: string): Promise<UserFile> {
    try {
      if (this.useMockApi) {
        return mockFileSystem.readFile(fileId);
      }
      const response = await axios.get(`${this.baseUrl}/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to read file:', error);
      throw error;
    }
  }

  async updateFile(fileId: string, request: UpdateFileRequest): Promise<FileOperationResponse> {
    try {
      if (this.useMockApi) {
        return mockFileSystem.updateFile(fileId, request);
      }
      const response = await axios.put(`${this.baseUrl}/${fileId}`, request);
      return response.data;
    } catch (error) {
      console.error('Failed to update file:', error);
      throw error;
    }
  }

  async deleteFile(fileId: string): Promise<FileOperationResponse> {
    try {
      if (this.useMockApi) {
        return mockFileSystem.deleteFile(fileId);
      }
      const response = await axios.delete(`${this.baseUrl}/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  async renameFile(fileId: string, newName: string): Promise<FileOperationResponse> {
    try {
      if (this.useMockApi) {
        return mockFileSystem.renameFile(fileId, newName);
      }
      const response = await axios.patch(`${this.baseUrl}/${fileId}/rename`, { name: newName });
      return response.data;
    } catch (error) {
      console.error('Failed to rename file:', error);
      throw error;
    }
  }

  async searchFiles(query: string, path: string): Promise<FileListResponse> {
    try {
      if (this.useMockApi) {
        return mockFileSystem.searchFiles(query, path);
      }
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: { query, path }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search files:', error);
      throw error;
    }
  }

  async createDirectory(path: string): Promise<FileOperationResponse> {
    try {
      if (this.useMockApi) {
        return mockFileSystem.createFile({
          name: path.split('/').pop() || '',
          path,
          type: 'directory',
          isDirectory: true,
          content: ''
        });
      }
      const response = await axios.post(`${this.baseUrl}/directory`, { path });
      return response.data;
    } catch (error) {
      console.error('Failed to create directory:', error);
      throw error;
    }
  }

  async shareFile(fileId: string): Promise<FileShareResponse> {
    try {
      if (this.useMockApi) {
        // Implement mock share file logic here
        throw new Error('Not implemented');
      }
      const response = await axios.post(`${this.baseUrl}/${fileId}/share`);
      return response.data;
    } catch (error) {
      console.error('Failed to share file:', error);
      throw error;
    }
  }

  async unshareFile(fileId: string): Promise<FileOperationResponse> {
    try {
      if (this.useMockApi) {
        // Implement mock unshare file logic here
        throw new Error('Not implemented');
      }
      const response = await axios.delete(`${this.baseUrl}/${fileId}/share`);
      return response.data;
    } catch (error) {
      console.error('Failed to unshare file:', error);
      throw error;
    }
  }

  async downloadFile(fileId: string, options?: DownloadOptions): Promise<Blob> {
    try {
      if (this.useMockApi) {
        // Implement mock download file logic here
        throw new Error('Not implemented');
      }
      const response = await axios.get(`${this.baseUrl}/${fileId}/download`, {
        responseType: 'blob',
        params: options
      });
      return response.data;
    } catch (error) {
      console.error('Failed to download file:', error);
      throw error;
    }
  }

  async exportUserFiles(): Promise<Blob> {
    try {
      if (this.useMockApi) {
        // Implement mock export user files logic here
        throw new Error('Not implemented');
      }
      const response = await axios.get(`${this.baseUrl}/export`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export user files:', error);
      throw error;
    }
  }
}
