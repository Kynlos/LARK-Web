import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { UserFile } from '../../types/fileSystem';
import { MonacoEditor } from '../editor/MonacoEditor';
import { UserFileSystemService } from '../../services/UserFileSystemService';

interface FilePreviewProps {
  file: UserFile | null;
  onClose: () => void;
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
const TEXT_EXTENSIONS = ['.txt', '.md', '.json', '.xml', '.csv', '.js', '.ts', '.jsx', '.tsx', '.html', '.css'];
const PDF_EXTENSIONS = ['.pdf'];

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    const loadContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const fileSystem = UserFileSystemService.getInstance();
        const fileContent = await fileSystem.readFile(file.id);
        setContent(fileContent);
      } catch (error) {
        setError('Failed to load file content');
        console.error('Error loading file:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [file]);

  const getFileExtension = (filename: string) => {
    return filename.toLowerCase().slice(filename.lastIndexOf('.'));
  };

  const renderContent = () => {
    if (!file) return null;
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      );
    }

    const extension = getFileExtension(file.name);

    if (IMAGE_EXTENSIONS.includes(extension)) {
      return (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <img
            src={URL.createObjectURL(new Blob([content as any], { type: file.type }))}
            alt={file.name}
            style={{ maxWidth: '100%', maxHeight: '70vh' }}
          />
        </Box>
      );
    }

    if (TEXT_EXTENSIONS.includes(extension)) {
      return (
        <Box sx={{ height: '70vh', width: '100%' }}>
          <MonacoEditor
            value={content || ''}
            language={extension.slice(1)}
            readOnly={true}
          />
        </Box>
      );
    }

    if (PDF_EXTENSIONS.includes(extension)) {
      const pdfUrl = URL.createObjectURL(new Blob([content as any], { type: 'application/pdf' }));
      return (
        <Box sx={{ height: '70vh', width: '100%' }}>
          <iframe
            src={pdfUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title={file.name}
          />
        </Box>
      );
    }

    return (
      <Box sx={{ p: 3 }}>
        <Typography>Preview not available for this file type.</Typography>
      </Box>
    );
  };

  return (
    <Dialog
      open={!!file}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">{file?.name}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};
