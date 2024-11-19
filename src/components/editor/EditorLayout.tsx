import React from 'react';
import { Box, Paper, Divider } from '@mui/material';
import { FileExplorer } from './FileExplorer';
import { TabBar } from './TabBar';
import { CodeEditor } from './Editor';
import { useEditorStore } from '../../stores/editorStore';

export const EditorLayout = () => {
  const { fileSystem } = useEditorStore();

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
        <FileExplorer />
      </Paper>

      {/* Editor Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TabBar />
        <Divider />
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <CodeEditor />
        </Box>
      </Box>
    </Box>
  );
};
