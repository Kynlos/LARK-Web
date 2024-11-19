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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CreateNewFolder as CreateNewFolderIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useFileSystemStore } from '../../stores/fileSystemStore';
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
  } = useFileSystemStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);

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
        await uploadFile(files[i], currentPath);
      }
      listFiles(currentPath);
    }
  };

  const handleCreateDirectory = async () => {
    if (newFolderName) {
      await createDirectory(currentPath + '/' + newFolderName);
      setNewFolderName('');
      setShowNewFolderDialog(false);
      listFiles(currentPath);
    }
  };

  const handleFileClick = (file: any) => {
    if (file.isDirectory) {
      setCurrentPath(currentPath + '/' + file.name);
      listFiles(currentPath + '/' + file.name);
    } else {
      setSelectedFile(file);
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
        await uploadFile(droppedFiles[i], currentPath);
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
          <Button
            component="span"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload
          </Button>
        </label>
        <Button
          variant="outlined"
          startIcon={<CreateNewFolderIcon />}
          onClick={() => setShowNewFolderDialog(true)}
        >
          New Folder
        </Button>
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
                        downloadFile(file);
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFile(file);
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

      <Dialog open={showNewFolderDialog} onClose={() => setShowNewFolderDialog(false)}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Create New Folder</Typography>
          <TextField
            fullWidth
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setShowNewFolderDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreateDirectory}
              disabled={!newFolderName}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};
