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
  Save as SaveIcon,
  FileUpload as ShareIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';
import { LordIcon } from '../common/LordIcon';
import MonacoEditor from '@monaco-editor/react';
import { useEditorStore } from '../../stores/editorStore';
import { useAuthStore } from '../../stores/authStore';
import * as monaco from 'monaco-editor';
import { AIWritingAssistant } from './AIWritingAssistant';

export const CodeEditor = () => {
  const { activeFile, updateFileContent, saveFile, isDirty } = useEditorStore();
  const { user } = useAuthStore();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const theme = useTheme();
  const [notificationsAnchor, setNotificationsAnchor] = React.useState<null | HTMLElement>(null);

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsEditorReady(true);

    editor.onDidChangeCursorSelection(() => {
      const selection = editor.getSelection();
      if (selection) {
        setSelectedText(editor.getModel()?.getValueInRange(selection) || '');
      }
    });
  };

  const handleInsertText = (text: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const position = editor.getPosition();
      if (position) {
        editor.executeEdits('ai-assistant', [{
          range: new monacoRef.current!.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column
          ),
          text: text
        }]);
      }
    }
  };

  const handleReplaceText = (text: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      if (selection) {
        editor.executeEdits('ai-assistant', [{
          range: selection,
          text: text
        }]);
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveFile(activeFile.id);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save file');
    } finally {
      setSaving(false);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateFileContent(activeFile.id, value);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(isFullscreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: theme.zIndex.modal,
          bgcolor: 'background.default',
        }),
      }}
    >
      <Box
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
          {isDirty && (
            <Chip
              label="Unsaved Changes"
              color="warning"
              size="small"
            />
          )}
        </Stack>

        <Stack direction="row" spacing={1}>
          <Tooltip title="Save (Ctrl+S)">
            <IconButton
              onClick={handleSave}
              disabled={!isDirty || saving}
            >
              {saving ? (
                <CircularProgress size={24} />
              ) : (
                <SaveIcon />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Share">
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton onClick={handleNotificationsClick}>
              <LordIcon
                icon="psnhyobz"
                size={24}
                state="hover-bell"
              />
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <IconButton onClick={toggleFullscreen}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <MonacoEditor
          height="100%"
          defaultLanguage="markdown"
          theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'vs-light'}
          value={activeFile?.content || ''}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            automaticLayout: true,
          }}
        />

        <AIWritingAssistant
          selectedText={selectedText}
          onInsertText={handleInsertText}
          onReplaceText={handleReplaceText}
        />
      </Box>

      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
      >
        <MenuItem onClick={handleNotificationsClose}>
          No new notifications
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
