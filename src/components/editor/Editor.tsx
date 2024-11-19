import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Button,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  Snackbar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  PlayArrow as RunIcon,
  Save as SaveIcon,
  FileUpload as ShareIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';
import { LordIcon } from '../common/LordIcon';
import MonacoEditor from '@monaco-editor/react';
import { useEditorStore } from '../../stores/editorStore';
import { useAuthStore } from '../../stores/authStore';
import { registerCasebookLanguage } from '../../languages/casebook';
import * as monaco from 'monaco-editor';

export const CodeEditor = () => {
  const { activeFile, updateFileContent, saveFile, isDirty } = useEditorStore();
  const { user } = useAuthStore();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const theme = useTheme();
  const [notificationsAnchor, setNotificationsAnchor] = React.useState<null | HTMLElement>(null);

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const languages = [
    { label: 'Python', value: 'python' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'cpp' },
  ];

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleEditorWillMount = (monaco: Monaco) => {
    monacoRef.current = monaco;
    registerCasebookLanguage();
  };

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    setIsEditorReady(true);
  };

  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
      case 'cc':
        return 'cpp';
      default:
        return 'plaintext';
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (activeFile?.isDirty) {
      timeoutId = setTimeout(async () => {
        try {
          setSaving(true);
          await saveFile(activeFile.id);
        } catch (error) {
          setSaveError(error instanceof Error ? error.message : 'Failed to save file');
        } finally {
          setSaving(false);
        }
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [activeFile, saveFile]);

  const renderEditor = () => {
    if (!activeFile) {
      return (
        <Box 
          sx={{ 
            p: 3, 
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <LordIcon
            src="https://cdn.lordicon.com/nocovwne.json"
            trigger="loop"
            size={64}
            colors={{
              primary: theme.palette.text.secondary,
              secondary: theme.palette.text.disabled,
            }}
          />
          <Typography variant="body1" color="text.secondary">
            No file selected
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Select a file from the file explorer to start editing
          </Typography>
        </Box>
      );
    }

    return (
      <MonacoEditor
        height="100%"
        language={getLanguage(activeFile.name)}
        theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
        value={activeFile.content}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        onChange={(value) => {
          if (value !== undefined) {
            updateFileContent(activeFile.id, value);
          }
        }}
        options={{
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          matchBrackets: 'always',
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          readOnly: saving,
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LordIcon
            src="https://cdn.lordicon.com/wloilxuq.json"
            trigger="hover"
            size={32}
            colors={{
              primary: theme.palette.primary.main,
              secondary: theme.palette.secondary.main,
            }}
          />
          <Typography variant="h5" fontWeight={600}>
            Code Editor
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {languages.map((lang) => (
            <Chip
              key={lang.value}
              label={lang.label}
              onClick={() => setSelectedLanguage(lang.value)}
              variant={selectedLanguage === lang.value ? 'filled' : 'outlined'}
              color={selectedLanguage === lang.value ? 'primary' : 'default'}
              sx={{
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: selectedLanguage === lang.value
                    ? theme.palette.primary.main
                    : alpha(theme.palette.primary.main, 0.04),
                },
              }}
            />
          ))}
          <IconButton size="small" onClick={handleNotificationsClick}>
            <LordIcon
              src="https://cdn.lordicon.com/psnhyobz.json"
              trigger="hover"
              size={32}
              colors={{
                primary: theme.palette.text.primary,
                secondary: theme.palette.text.secondary,
              }}
            />
          </IconButton>
        </Stack>
      </Box>

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          ...(isFullscreen && {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1300,
            m: 0,
            borderRadius: 0,
          }),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.background.paper, 0.6),
            backdropFilter: 'blur(8px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {activeFile ? (
              <>
                <Tooltip title="Run code">
                  <IconButton color="primary" size="small">
                    <RunIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Save">
                  <span>
                    <IconButton 
                      size="small" 
                      onClick={() => saveFile(activeFile.id)}
                      disabled={saving}
                    >
                      <SaveIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton size="small">
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <IconButton color="primary" size="small" disabled>
                  <RunIcon />
                </IconButton>
                <IconButton size="small" disabled>
                  <SaveIcon />
                </IconButton>
                <IconButton size="small" disabled>
                  <ShareIcon />
                </IconButton>
              </>
            )}
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Tooltip title="Editor settings">
              <IconButton size="small">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
            <IconButton size="small" onClick={handleFullscreenToggle}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {renderEditor()}
          {saving && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                p: 1,
                borderRadius: 1,
              }}
            >
              <CircularProgress size={16} />
              <Typography variant="caption">Saving...</Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          minHeight: 120,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            Output
          </Typography>
          <Button
            size="small"
            startIcon={<CodeIcon />}
            variant="outlined"
            sx={{ textTransform: 'none' }}
            disabled={!activeFile}
          >
            View Raw
          </Button>
        </Box>
        <Box
          sx={{
            flex: 1,
            p: 2,
            bgcolor: alpha(theme.palette.background.paper, 0.6),
            borderRadius: 1,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.875rem',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {activeFile ? 'Run your code to see the output here...' : 'Select a file to get started'}
          </Typography>
        </Box>
      </Paper>

      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        onClick={handleNotificationsClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 300,
            maxHeight: 400,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Box sx={{ p: 2, width: '100%' }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Notifications
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              New comment on your code
            </Typography>
            <Typography variant="caption" color="text.secondary">
              2 minutes ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              Your code was reviewed
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 hour ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ py: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              System update available
            </Typography>
            <Typography variant="caption" color="text.secondary">
              1 day ago
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      <Snackbar
        open={!!saveError}
        autoHideDuration={6000}
        onClose={() => setSaveError(null)}
        message={saveError}
      />
    </Box>
  );
};
