import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert
} from '@mui/material';
import { useEditorStore } from '../../stores/editorStore';

interface FileOperationDialogProps {
  open: boolean;
  onClose: () => void;
  type: 'file' | 'folder';
  parentPath?: string;
  initialName?: string;
  mode: 'create' | 'rename';
}

export const FileOperationDialog: React.FC<FileOperationDialogProps> = ({
  open,
  onClose,
  type,
  parentPath = '/',
  initialName = '',
  mode
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const { createFile, createFolder, renameFile } = useEditorStore();

  const handleSubmit = async () => {
    try {
      if (!name.trim()) {
        setError('Name cannot be empty');
        return;
      }

      if (mode === 'create') {
        if (type === 'file') {
          await createFile(parentPath, name);
        } else {
          await createFolder(parentPath, name);
        }
      } else {
        await renameFile(parentPath, name);
      }

      onClose();
      setName('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleClose = () => {
    setName('');
    setError(null);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: '400px'
        }
      }}
    >
      <DialogTitle>
        {mode === 'create' ? `Create New ${type}` : `Rename ${type}`}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          label={`${type} Name`}
          type="text"
          fullWidth
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {mode === 'create' ? 'Create' : 'Rename'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
