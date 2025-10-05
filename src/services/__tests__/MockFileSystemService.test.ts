import { describe, it, expect, beforeEach } from 'vitest';
import { mockFileSystem } from '../MockFileSystemService';

describe('MockFileSystemService', () => {
  describe('File Creation', () => {
    it('should create a new file', async () => {
      const response = await mockFileSystem.createFile({
        name: 'newfile.txt',
        path: '/newfile.txt',
        type: 'text/plain',
        isDirectory: false,
        content: 'Test content',
      });

      expect(response.success).toBe(true);
      expect(response.file).toBeDefined();
      expect(response.file?.name).toBe('newfile.txt');
      expect(response.file?.content).toBe('Test content');
    });

    it('should prevent duplicate file creation', async () => {
      await mockFileSystem.createFile({
        name: 'duplicate.txt',
        path: '/duplicate.txt',
        type: 'text/plain',
        isDirectory: false,
        content: 'Content',
      });

      const response = await mockFileSystem.createFile({
        name: 'duplicate.txt',
        path: '/duplicate.txt',
        type: 'text/plain',
        isDirectory: false,
        content: 'Content',
      });

      expect(response.success).toBe(false);
      expect(response.message).toContain('already exists');
    });
  });

  describe('Directory Creation', () => {
    it('should create a new directory', async () => {
      const response = await mockFileSystem.createDirectory('/test-dir');

      expect(response.success).toBe(true);
      expect(response.file?.isDirectory).toBe(true);
    });

    it('should prevent duplicate directory creation', async () => {
      await mockFileSystem.createDirectory('/duplicate-dir');
      const response = await mockFileSystem.createDirectory('/duplicate-dir');

      expect(response.success).toBe(false);
      expect(response.message).toContain('already exists');
    });
  });

  describe('File Reading', () => {
    it('should read an existing file', async () => {
      const createResponse = await mockFileSystem.createFile({
        name: 'readable.txt',
        path: '/readable.txt',
        type: 'text/plain',
        isDirectory: false,
        content: 'Read this',
      });

      const file = await mockFileSystem.readFile(createResponse.file!.id);

      expect(file.content).toBe('Read this');
      expect(file.name).toBe('readable.txt');
    });

    it('should throw error for non-existent file', async () => {
      await expect(mockFileSystem.readFile('non-existent-id')).rejects.toThrow(
        'File not found'
      );
    });
  });

  describe('File Update', () => {
    it('should update file content', async () => {
      const createResponse = await mockFileSystem.createFile({
        name: 'update.txt',
        path: '/update.txt',
        type: 'text/plain',
        isDirectory: false,
        content: 'Original',
      });

      const updateResponse = await mockFileSystem.updateFile(
        createResponse.file!.id,
        { content: 'Updated' }
      );

      expect(updateResponse.success).toBe(true);
      expect(updateResponse.file?.content).toBe('Updated');
    });

    it('should update file name', async () => {
      const createResponse = await mockFileSystem.createFile({
        name: 'oldname.txt',
        path: '/oldname.txt',
        type: 'text/plain',
        isDirectory: false,
        content: 'Content',
      });

      const updateResponse = await mockFileSystem.updateFile(
        createResponse.file!.id,
        { name: 'newname.txt' }
      );

      expect(updateResponse.success).toBe(true);
      expect(updateResponse.file?.name).toBe('newname.txt');
    });

    it('should return error for non-existent file update', async () => {
      const response = await mockFileSystem.updateFile('fake-id', {
        content: 'New content',
      });

      expect(response.success).toBe(false);
      expect(response.message).toContain('not found');
    });
  });

  describe('File Deletion', () => {
    it('should delete an existing file', async () => {
      const createResponse = await mockFileSystem.createFile({
        name: 'delete.txt',
        path: '/delete.txt',
        type: 'text/plain',
        isDirectory: false,
        content: 'To be deleted',
      });

      const deleteResponse = await mockFileSystem.deleteFile(
        createResponse.file!.id
      );

      expect(deleteResponse.success).toBe(true);

      await expect(
        mockFileSystem.readFile(createResponse.file!.id)
      ).rejects.toThrow('File not found');
    });

    it('should return error when deleting non-existent file', async () => {
      const response = await mockFileSystem.deleteFile('fake-id');

      expect(response.success).toBe(false);
      expect(response.message).toContain('not found');
    });
  });

  describe('File Renaming', () => {
    it('should rename a file', async () => {
      const createResponse = await mockFileSystem.createFile({
        name: 'original.txt',
        path: '/original.txt',
        type: 'text/plain',
        isDirectory: false,
        content: 'Content',
      });

      const renameResponse = await mockFileSystem.renameFile(
        createResponse.file!.id,
        'renamed.txt'
      );

      expect(renameResponse.success).toBe(true);
      expect(renameResponse.file?.name).toBe('renamed.txt');
      expect(renameResponse.file?.path).toBe('/renamed.txt');
    });

    it('should prevent renaming to existing file name', async () => {
      await mockFileSystem.createFile({
        name: 'existing.txt',
        path: '/existing.txt',
        type: 'text/plain',
        isDirectory: false,
        content: 'Content 1',
      });

      const createResponse2 = await mockFileSystem.createFile({
        name: 'toRename.txt',
        path: '/toRename.txt',
        type: 'text/plain',
        isDirectory: false,
        content: 'Content 2',
      });

      const renameResponse = await mockFileSystem.renameFile(
        createResponse2.file!.id,
        'existing.txt'
      );

      expect(renameResponse.success).toBe(false);
      expect(renameResponse.message).toContain('already exists');
    });

    it('should return error for non-existent file rename', async () => {
      const response = await mockFileSystem.renameFile('fake-id', 'newname.txt');

      expect(response.success).toBe(false);
      expect(response.message).toContain('not found');
    });
  });

  describe('File Search', () => {
    it('should search files by name', async () => {
      await mockFileSystem.createFile({
        name: 'search-test.txt',
        path: '/search-test.txt',
        type: 'text/plain',
        isDirectory: false,
        content: 'Content',
      });

      const results = await mockFileSystem.searchFiles('search', '/');

      expect(results.files.length).toBeGreaterThan(0);
      expect(results.files.some((f) => f.name.includes('search'))).toBe(true);
    });

    it('should search files by content', async () => {
      await mockFileSystem.createFile({
        name: 'content-search.txt',
        path: '/content-search.txt',
        type: 'text/plain',
        isDirectory: false,
        content: 'This contains searchterm in the content',
      });

      const results = await mockFileSystem.searchFiles('searchterm', '/');

      expect(results.files.length).toBeGreaterThan(0);
      expect(
        results.files.some((f) => f.content?.includes('searchterm'))
      ).toBe(true);
    });
  });

  describe('List Files', () => {
    it('should list root level files', async () => {
      const results = await mockFileSystem.listFiles('/');

      expect(results.files).toBeDefined();
      expect(Array.isArray(results.files)).toBe(true);
    });
  });
});
