export interface UserFile {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  isDirectory: boolean;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFileRequest {
  name: string;
  path: string;
  type: string;
  isDirectory: boolean;
  content: string;
}

export interface UpdateFileRequest {
  name?: string;
  content?: string;
}

export interface FileOperationResponse {
  success: boolean;
  message: string;
  file?: UserFile;
}

export interface FileListResponse {
  files: UserFile[];
}

export interface FileShareResponse {
  success: boolean;
  message: string;
  shareUrl?: string;
}

export interface DownloadOptions {
  format?: string;
  quality?: number;
}

export interface FileSystemService {
  listFiles(path: string): Promise<FileListResponse>;
  createFile(request: CreateFileRequest): Promise<FileOperationResponse>;
  readFile(fileId: string): Promise<UserFile>;
  updateFile(fileId: string, request: UpdateFileRequest): Promise<FileOperationResponse>;
  deleteFile(fileId: string): Promise<FileOperationResponse>;
  searchFiles(query: string, path: string): Promise<FileListResponse>;
  createDirectory(path: string): Promise<FileOperationResponse>;
}
