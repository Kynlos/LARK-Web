import { 
  UserFile, 
  CreateFileRequest, 
  UpdateFileRequest, 
  FileOperationResponse, 
  FileListResponse,
  FileSystemService 
} from '../types/fileSystem';

class MockFileSystemService implements FileSystemService {
  private files: Map<string, UserFile>;
  private nextId: number;

  constructor() {
    this.files = new Map();
    this.nextId = 1;
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleFiles: CreateFileRequest[] = [
      {
        name: 'example.txt',
        path: '/example.txt',
        type: 'text/plain',
        isDirectory: false,
        content: 'This is a sample text file.\nIt contains multiple lines.\nFeel free to edit it!'
      },
      {
        name: 'sample.md',
        path: '/sample.md',
        type: 'text/markdown',
        isDirectory: false,
        content: '# Sample Markdown\n\nThis is a *markdown* file with some **formatting**.'
      },
      {
        name: 'documents',
        path: '/documents',
        type: 'directory',
        isDirectory: true,
        content: ''
      }
    ];

    sampleFiles.forEach(file => this.createFile(file));
  }

  private generateId(): string {
    return (this.nextId++).toString();
  }

  private getFileByPath(path: string): UserFile | undefined {
    for (const file of this.files.values()) {
      if (file.path === path) {
        return file;
      }
    }
    return undefined;
  }

  async listFiles(path: string): Promise<FileListResponse> {
    const files = Array.from(this.files.values())
      .filter(file => {
        if (path === '/') {
          return file.path.split('/').length === 2; // Only root level files
        }
        return file.path.startsWith(path + '/') && 
               file.path.split('/').length === path.split('/').length + 1;
      });

    return { files };
  }

  async createFile(request: CreateFileRequest): Promise<FileOperationResponse> {
    const existingFile = this.getFileByPath(request.path);
    if (existingFile) {
      return {
        success: false,
        message: 'File already exists at this path',
      };
    }

    const newFile: UserFile = {
      id: this.generateId(),
      name: request.name,
      path: request.path,
      type: request.type,
      size: request.content.length,
      isDirectory: request.isDirectory,
      content: request.content,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.files.set(newFile.id, newFile);

    return {
      success: true,
      message: 'File created successfully',
      file: newFile
    };
  }

  async readFile(fileId: string): Promise<UserFile> {
    const file = this.files.get(fileId);
    if (!file) {
      throw new Error('File not found');
    }
    return file;
  }

  async updateFile(fileId: string, request: UpdateFileRequest): Promise<FileOperationResponse> {
    const file = this.files.get(fileId);
    if (!file) {
      return {
        success: false,
        message: 'File not found'
      };
    }

    const updatedFile: UserFile = {
      ...file,
      name: request.name || file.name,
      content: request.content !== undefined ? request.content : file.content,
      updatedAt: new Date()
    };

    this.files.set(fileId, updatedFile);

    return {
      success: true,
      message: 'File updated successfully',
      file: updatedFile
    };
  }

  async deleteFile(fileId: string): Promise<FileOperationResponse> {
    const file = this.files.get(fileId);
    if (!file) {
      return {
        success: false,
        message: 'File not found'
      };
    }

    this.files.delete(fileId);

    return {
      success: true,
      message: 'File deleted successfully'
    };
  }

  async searchFiles(query: string, path: string): Promise<FileListResponse> {
    const normalizedQuery = query.toLowerCase();
    const files = Array.from(this.files.values())
      .filter(file => 
        file.path.startsWith(path) && 
        (file.name.toLowerCase().includes(normalizedQuery) || 
         (file.content && file.content.toLowerCase().includes(normalizedQuery)))
      );

    return { files };
  }
}

export const mockFileSystem = new MockFileSystemService();
