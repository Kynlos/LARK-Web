import React, { useEffect, useState } from 'react';
import { Box, Paper, Divider, Button, Typography } from '@mui/material';
import { FileExplorer } from './FileExplorer';
import { TabBar } from './TabBar';
import { CodeEditor } from './Editor';
import { useEditorStore } from '../../stores/editorStore';

export const EditorLayout = () => {
  const [isSelectingDirectory, setIsSelectingDirectory] = useState(false);
  const { fileSystem } = useEditorStore();

  useEffect(() => {
    // Check if we have a project directory selected
    const checkProjectDirectory = async () => {
      try {
        await fileSystem.requestProjectAccess();
      } catch (error) {
        console.error('Failed to access project directory:', error);
      }
    };
    checkProjectDirectory();
  }, [fileSystem]);

  const handleSelectDirectory = async () => {
    setIsSelectingDirectory(true);
    try {
      await fileSystem.requestProjectAccess();
    } catch (error) {
      console.error('Failed to select project directory:', error);
    } finally {
      setIsSelectingDirectory(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 64px)', // Subtract AppBar height
        overflow: 'hidden'
      }}
    >
      {/* File Explorer */}
      <Paper
        elevation={0}
        sx={{
          width: 250,
          borderRight: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleSelectDirectory}
            disabled={isSelectingDirectory}
            fullWidth
          >
            Select Project Directory
          </Button>
        </Box>
        <FileExplorer />
      </Paper>

      {/* Editor Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <TabBar />
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden'
          }}
        >
          <CodeEditor />
        </Box>
      </Box>
    </Box>
  );
};
