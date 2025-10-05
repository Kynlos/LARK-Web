import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CreateNewFolder as CreateNewFolderIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  NoteAdd as NoteAddIcon,
} from '@mui/icons-material';
import { useFileSystemStore } from '../../stores/fileSystemStore';
import { useEditorStore } from '../../stores/editorStore';
import { FilePreview } from './FilePreview';
import { useAuthStore } from '../../stores/authStore';

export const FileExplorer: React.FC = () => {
  const { user } = useAuthStore();
  const {
    files,
    currentPath,
    setCurrentPath,
    uploadFile,
    downloadFile,
    deleteFile,
    createDirectory,
    listFiles,
    searchFiles,
    createFile,
  } = useFileSystemStore();

  const { openFile } = useEditorStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [newItemDialog, setNewItemDialog] = useState<{
    open: boolean;
    type: 'file' | 'folder';
    name: string;
  }>({
    open: false,
    type: 'file',
    name: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with the user's root directory
    if (user?.id) {
      setCurrentPath(`/${user.id}`);
      listFiles(`/${user.id}`);
    }
  }, [user?.id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        await uploadFile(currentPath, files[i]);
      }
      listFiles(currentPath);
    }
  };

  const handleCreateItem = async () => {
    const { type, name } = newItemDialog;
    if (name) {
      try {
        if (type === 'folder') {
          await createDirectory(`${currentPath}/${name}`);
        } else {
          const fullPath = `${currentPath}/${name}`;
          const response = await createFile({
            name,
            path: fullPath,
            type: 'text/plain',
            isDirectory: false,
            content: '',
          });
          
          // If file creation was successful and we got a file back
          if (response?.file) {
            // Open the new file in the editor
            await openFile(response.file.id);
          }
        }
        
        // Refresh the file list
        await listFiles(currentPath);
        
        // Close the dialog
        setNewItemDialog({ open: false, type: 'file', name: '' });
      } catch (error) {
        console.error('Failed to create item:', error);
        setError(`Failed to create ${newItemDialog.type}. Please try again.`);
      }
    }
  };

  const handleFileClick = async (file: any) => {
    if (file.isDirectory) {
      setCurrentPath(currentPath + '/' + file.name);
      listFiles(currentPath + '/' + file.name);
    } else {
      try {
        // First open the file in the editor
        await openFile(file.id);
        // Then show the preview
        setSelectedFile(file);
      } catch (error) {
        console.error('Failed to open file:', error);
        setError('Failed to open file. Please try again.');
      }
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query) {
      searchFiles(query, currentPath);
    } else {
      listFiles(currentPath);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    
    if (droppedFiles) {
      for (let i = 0; i < droppedFiles.length; i++) {
        await uploadFile(currentPath, droppedFiles[i]);
      }
      listFiles(currentPath);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h5">Files</Typography>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search files..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Tooltip title="Upload files">
            <Button
              component="span"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload
            </Button>
          </Tooltip>
        </label>
        <Tooltip title="Create new folder">
          <Button
            variant="outlined"
            startIcon={<CreateNewFolderIcon />}
            onClick={() => setNewItemDialog({ open: true, type: 'folder', name: '' })}
          >
            New Folder
          </Button>
        </Tooltip>
        <Tooltip title="Create new file">
          <Button
            variant="outlined"
            startIcon={<NoteAddIcon />}
            onClick={() => setNewItemDialog({ open: true, type: 'file', name: '' })}
          >
            New File
          </Button>
        </Tooltip>
      </Box>

      <Paper
        sx={{ width: '100%', mb: 2 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Size</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <TableRow
                  key={file.name}
                  hover
                  onClick={() => handleFileClick(file)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{file.name}</TableCell>
                  <TableCell align="right">
                    {file.isDirectory ? '--' : file.size}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(file.id);
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {selectedFile && (
        <FilePreview
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}

      <Dialog
        open={newItemDialog.open}
        onClose={() => setNewItemDialog({ open: false, type: 'file', name: '' })}
      >
        <DialogTitle>
          Create New {newItemDialog.type === 'folder' ? 'Folder' : 'File'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newItemDialog.name}
            onChange={(e) => setNewItemDialog({ ...newItemDialog, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewItemDialog({ open: false, type: 'file', name: '' })}>
            Cancel
          </Button>
          <Button onClick={handleCreateItem} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FileExplorer;
