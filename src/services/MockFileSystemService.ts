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
    // Ensure the path is properly formatted
    const fullPath = request.path.startsWith('/') ? request.path : `/${request.path}`;
    
    // Check if file already exists
    const existingFile = Array.from(this.files.values()).find(
      f => f.path === fullPath || f.path === `${fullPath}/${request.name}`
    );
    
    if (existingFile) {
      return {
        success: false,
        message: 'File already exists at this path',
      };
    }

    // Create the new file
    const newFile: UserFile = {
      id: this.generateId(),
      name: request.name,
      path: fullPath,
      type: request.type || 'text/plain',
      size: request.content?.length || 0,
      isDirectory: request.isDirectory,
      content: request.content || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to our files map
    this.files.set(newFile.id, newFile);

    return {
      success: true,
      message: 'File created successfully',
      file: newFile
    };
  }

  async createDirectory(path: string): Promise<FileOperationResponse> {
    // Ensure the path is properly formatted
    const fullPath = path.startsWith('/') ? path : `/${path}`;
    const name = fullPath.split('/').pop() || '';
    const parentPath = fullPath.substring(0, fullPath.lastIndexOf('/'));

    // Check if directory already exists
    const existingDir = Array.from(this.files.values()).find(
      f => f.path === fullPath && f.isDirectory
    );
    
    if (existingDir) {
      return {
        success: false,
        message: 'Directory already exists at this path',
      };
    }

    // Create the new directory
    const newDir: UserFile = {
      id: this.generateId(),
      name,
      path: fullPath,
      type: 'directory',
      size: 0,
      isDirectory: true,
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to our files map
    this.files.set(newDir.id, newDir);

    return {
      success: true,
      message: 'Directory created successfully',
      file: newDir
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
