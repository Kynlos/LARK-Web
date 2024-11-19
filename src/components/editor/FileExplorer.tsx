import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import {
  FolderOutlined,
  InsertDriveFileOutlined,
  MoreVert,
  CreateNewFolder,
  NoteAdd,
  Delete,
  Edit
} from '@mui/icons-material';
import { useEditorStore } from '../../stores/editorStore';
import { ProjectFile } from '../../core/types/editor';
import { FileOperationDialog } from './FileOperationDialog';

export const FileExplorer = () => {
  const {
    projectFiles,
    activeFile,
    openFile,
    createFile,
    createFolder,
    deleteFile,
    renameFile
  } = useEditorStore();

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
    file: ProjectFile | null;
  } | null>(null);

  const [selectedFile, setSelectedFile] = React.useState<ProjectFile | null>(null);
  const [dialogConfig, setDialogConfig] = React.useState<{
    open: boolean;
    type: 'file' | 'folder';
    mode: 'create' | 'rename';
    parentPath?: string;
    initialName?: string;
  }>({
    open: false,
    type: 'file',
    mode: 'create'
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent, targetFile?: ProjectFile) => {
    e.preventDefault();
    e.stopPropagation();

    const items = Array.from(e.dataTransfer.items);
    const files = items
      .filter(item => item.kind === 'file')
      .map(item => item.getAsFile())
      .filter((file): file is File => file !== null);

    const targetPath = targetFile?.isDirectory ? targetFile.path : targetFile?.parentPath ?? '/';

    try {
      for (const file of files) {
        const content = await file.text();
        await createFile(targetPath, file.name, content);
      }
    } catch (error) {
      console.error('Error handling dropped files:', error);
    }
  };

  const handleRename = (file: ProjectFile) => {
    setDialogConfig({
      open: true,
      type: file.isDirectory ? 'folder' : 'file',
      mode: 'rename',
      parentPath: file.path,
      initialName: file.name
    });
  };

  const handleCreate = (type: 'file' | 'folder', parentFile?: ProjectFile) => {
    setDialogConfig({
      open: true,
      type,
      mode: 'create',
      parentPath: parentFile?.path ?? '/'
    });
  };

  const handleContextMenu = (event: React.MouseEvent, file: ProjectFile) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      file,
    });
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleFileClick = (file: ProjectFile) => {
    if (!file.isDirectory) {
      openFile(file.id);
    }
  };

  const renderFileTree = (files: ProjectFile[] = [], depth = 0) => {
    return (
      <List dense>
        {files.map((file) => (
          <ListItem
            key={file.id}
            sx={{
              pl: depth * 2,
              cursor: 'pointer',
              bgcolor: activeFile?.id === file.id ? 'action.selected' : 'inherit',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            onClick={() => handleFileClick(file)}
            onContextMenu={(e) => handleContextMenu(e, file)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, file)}
            draggable
          >
            <ListItemIcon>
              {file.isDirectory ? (
                <FolderOutlined />
              ) : (
                <InsertDriveFileOutlined />
              )}
            </ListItemIcon>
            <ListItemText primary={file.name} />
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleContextMenu(e, file);
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Box
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle2">Files</Typography>
        <Box>
          <IconButton
            size="small"
            onClick={() => {
              handleCreate('folder');
            }}
          >
            <CreateNewFolder fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              handleCreate('file');
            }}
          >
            <NoteAdd fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      {renderFileTree(projectFiles)}

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            if (contextMenu?.file) {
              handleRename(contextMenu.file);
            }
            handleClose();
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (contextMenu?.file) {
              deleteFile(contextMenu.file.id);
            }
            handleClose();
          }}
        >
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      <FileOperationDialog
        {...dialogConfig}
        onClose={() => setDialogConfig(prev => ({ ...prev, open: false }))}
      />
    </Box>
  );
};
