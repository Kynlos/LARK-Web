import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useEditorStore } from '../editorStore';
import { act } from '@testing-library/react';

describe('editorStore', () => {
  beforeEach(() => {
    const { files, openFiles, activeFile } = useEditorStore.getState();
    useEditorStore.setState({
      files: [],
      openFiles: [],
      activeFile: null,
      recentFiles: [],
      projectFiles: [],
    });
  });

  describe('File Management', () => {
    it('should initialize with empty state', () => {
      const { files, openFiles, activeFile } = useEditorStore.getState();
      expect(files).toEqual([]);
      expect(openFiles).toEqual([]);
      expect(activeFile).toBeNull();
    });

    it('should update file content', () => {
      const testFile = {
        id: 'test-1',
        name: 'test.txt',
        content: 'initial content',
        path: '/test.txt',
        type: 'text/plain',
        size: 100,
        isUnsaved: false,
        language: 'plaintext',
        lastModified: new Date(),
      };

      useEditorStore.setState({ files: [testFile] });

      act(() => {
        useEditorStore.getState().updateFileContent('test-1', 'updated content');
      });

      const { files } = useEditorStore.getState();
      expect(files[0].content).toBe('updated content');
      expect(files[0].isUnsaved).toBe(true);
    });

    it('should close file and remove from open files', () => {
      const testFile = {
        id: 'test-1',
        name: 'test.txt',
        content: 'content',
        path: '/test.txt',
        type: 'text/plain',
        size: 100,
        isUnsaved: false,
        language: 'plaintext',
        lastModified: new Date(),
      };

      useEditorStore.setState({
        files: [testFile],
        openFiles: ['test-1'],
        activeFile: testFile,
      });

      act(() => {
        useEditorStore.getState().closeFile('test-1');
      });

      const { openFiles, activeFile } = useEditorStore.getState();
      expect(openFiles).not.toContain('test-1');
      expect(activeFile).toBeNull();
    });

    it('should not remove active file if closing different file', () => {
      const file1 = {
        id: 'test-1',
        name: 'test1.txt',
        content: 'content1',
        path: '/test1.txt',
        type: 'text/plain',
        size: 100,
        isUnsaved: false,
        language: 'plaintext',
        lastModified: new Date(),
      };

      const file2 = {
        id: 'test-2',
        name: 'test2.txt',
        content: 'content2',
        path: '/test2.txt',
        type: 'text/plain',
        size: 100,
        isUnsaved: false,
        language: 'plaintext',
        lastModified: new Date(),
      };

      useEditorStore.setState({
        files: [file1, file2],
        openFiles: ['test-1', 'test-2'],
        activeFile: file1,
      });

      act(() => {
        useEditorStore.getState().closeFile('test-2');
      });

      const { openFiles, activeFile } = useEditorStore.getState();
      expect(openFiles).toEqual(['test-1']);
      expect(activeFile).toBe(file1);
    });
  });

  describe('Recent Files', () => {
    it('should add file to recent files when opened', async () => {
      const mockFile = {
        id: 'test-1',
        name: 'test.txt',
        content: 'content',
        path: '/test.txt',
        type: 'text/plain',
        size: 100,
        isDirectory: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockFileSystem = {
        readFile: vi.fn().mockResolvedValue(mockFile),
      };

      useEditorStore.setState({
        fileSystem: mockFileSystem as any,
      });

      await act(async () => {
        await useEditorStore.getState().openFile('test-1');
      });

      const { recentFiles } = useEditorStore.getState();
      expect(recentFiles).toContain('test-1');
    });

    it('should limit recent files to 10', async () => {
      const mockReadFile = vi.fn((id: string) =>
        Promise.resolve({
          id,
          name: `test-${id}.txt`,
          content: 'content',
          path: `/test-${id}.txt`,
          type: 'text/plain',
          size: 100,
          isDirectory: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      useEditorStore.setState({
        fileSystem: { readFile: mockReadFile } as any,
      });

      for (let i = 0; i < 12; i++) {
        await act(async () => {
          await useEditorStore.getState().openFile(`test-${i}`);
        });
      }

      const { recentFiles } = useEditorStore.getState();
      expect(recentFiles.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Editor Instance', () => {
    it('should set editor instance', () => {
      const mockEditor = { getValue: vi.fn() };

      act(() => {
        useEditorStore.getState().setEditorInstance(mockEditor);
      });

      const { editorInstance } = useEditorStore.getState();
      expect(editorInstance).toBe(mockEditor);
    });
  });
});
