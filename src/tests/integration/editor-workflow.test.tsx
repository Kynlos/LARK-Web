import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditorStore } from '../../stores/editorStore';
import { mockFileSystem } from '../../services/MockFileSystemService';

describe('Editor Workflow Integration', () => {
  beforeEach(() => {
    useEditorStore.setState({
      files: [],
      openFiles: [],
      activeFile: null,
      recentFiles: [],
      projectFiles: [],
    });
  });

  it('should complete full file creation and editing workflow', async () => {
    const { result } = renderHook(() => useEditorStore());

    const createResponse = await mockFileSystem.createFile({
      name: 'workflow-test.txt',
      path: '/workflow-test.txt',
      type: 'text/plain',
      isDirectory: false,
      content: 'Initial content',
    });

    expect(createResponse.success).toBe(true);
    const fileId = createResponse.file!.id;

    await act(async () => {
      await result.current.openFile(fileId);
    });

    expect(result.current.activeFile?.id).toBe(fileId);
    expect(result.current.openFiles).toContain(fileId);
    expect(result.current.recentFiles).toContain(fileId);

    act(() => {
      result.current.updateFileContent(fileId, 'Updated content');
    });

    expect(result.current.files[0].content).toBe('Updated content');
    expect(result.current.files[0].isUnsaved).toBe(true);

    await act(async () => {
      await result.current.saveFile(fileId);
    });

    expect(result.current.files[0].isUnsaved).toBe(false);

    act(() => {
      result.current.closeFile(fileId);
    });

    expect(result.current.openFiles).not.toContain(fileId);
    expect(result.current.activeFile).toBeNull();
  });

  it('should handle multiple files open simultaneously', async () => {
    const { result } = renderHook(() => useEditorStore());

    const file1Response = await mockFileSystem.createFile({
      name: 'file1.txt',
      path: '/file1.txt',
      type: 'text/plain',
      isDirectory: false,
      content: 'File 1 content',
    });

    const file2Response = await mockFileSystem.createFile({
      name: 'file2.txt',
      path: '/file2.txt',
      type: 'text/plain',
      isDirectory: false,
      content: 'File 2 content',
    });

    const file1Id = file1Response.file!.id;
    const file2Id = file2Response.file!.id;

    await act(async () => {
      await result.current.openFile(file1Id);
    });

    await act(async () => {
      await result.current.openFile(file2Id);
    });

    expect(result.current.openFiles).toHaveLength(2);
    expect(result.current.openFiles).toContain(file1Id);
    expect(result.current.openFiles).toContain(file2Id);
    expect(result.current.activeFile?.id).toBe(file2Id);

    act(() => {
      result.current.updateFileContent(file1Id, 'File 1 updated');
      result.current.updateFileContent(file2Id, 'File 2 updated');
    });

    const file1 = result.current.files.find((f) => f.id === file1Id);
    const file2 = result.current.files.find((f) => f.id === file2Id);

    expect(file1?.content).toBe('File 1 updated');
    expect(file2?.content).toBe('File 2 updated');
    expect(file1?.isUnsaved).toBe(true);
    expect(file2?.isUnsaved).toBe(true);
  });

  it('should handle file rename workflow', async () => {
    const { result } = renderHook(() => useEditorStore());

    const createResponse = await mockFileSystem.createFile({
      name: 'original.txt',
      path: '/original.txt',
      type: 'text/plain',
      isDirectory: false,
      content: 'Content',
    });

    const fileId = createResponse.file!.id;

    await act(async () => {
      await result.current.openFile(fileId);
    });

    await act(async () => {
      await result.current.renameFile(fileId, 'renamed.txt');
    });

    const file = result.current.files.find((f) => f.id === fileId);
    expect(file?.name).toBe('renamed.txt');
    expect(file?.path).toBe('/renamed.txt');
  });

  it('should handle file deletion workflow', async () => {
    const { result } = renderHook(() => useEditorStore());

    const createResponse = await mockFileSystem.createFile({
      name: 'to-delete.txt',
      path: '/to-delete.txt',
      type: 'text/plain',
      isDirectory: false,
      content: 'Content',
    });

    const fileId = createResponse.file!.id;

    await act(async () => {
      await result.current.openFile(fileId);
    });

    expect(result.current.openFiles).toContain(fileId);
    expect(result.current.activeFile?.id).toBe(fileId);

    await act(async () => {
      await result.current.deleteFile(fileId);
    });

    expect(result.current.files.find((f) => f.id === fileId)).toBeUndefined();
    expect(result.current.openFiles).not.toContain(fileId);
    expect(result.current.activeFile).toBeNull();
  });
});
