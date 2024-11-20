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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Toolbar,
  ButtonGroup,
} from '@mui/material';
import {
  Save as SaveIcon,
  FileUpload as ShareIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  FormatStrikethrough as FormatStrikethroughIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  FormatQuote as FormatQuoteIcon,
  Code as CodeIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  TableChart as TableIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  ContentCut as CutIcon,
  ContentCopy as CopyIcon,
  ContentPaste as PasteIcon,
  Search as SearchIcon,
  FindReplace as FindReplaceIcon,
  FormatClear as ClearFormattingIcon,
  AutoFixHigh as AIIcon,
} from '@mui/icons-material';
import { LordIcon } from '../common/LordIcon';
import MonacoEditor from '@monaco-editor/react';
import { useEditorStore } from '../../stores/editorStore';
import { useAuthStore } from '../../stores/authStore';
import * as monaco from 'monaco-editor';
import { AIWritingAssistant } from './AIWritingAssistant';
import QuickActionBar from './QuickActionBar';
import AISettingsDialog from '../settings/AISettingsDialog';

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
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
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
    if (value !== undefined && activeFile) {
      updateFileContent(activeFile.id, value);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleFormatText = (format: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const model = editor.getModel();
      
      if (!selection || !model) return;
      
      const selectedText = model.getValueInRange(selection);
      let formattedText = selectedText;
      
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'underline':
          formattedText = `__${selectedText}__`;
          break;
        case 'strikethrough':
          formattedText = `~~${selectedText}~~`;
          break;
        case 'bullet':
          formattedText = selectedText
            .split('\n')
            .map(line => `- ${line}`)
            .join('\n');
          break;
        case 'number':
          formattedText = selectedText
            .split('\n')
            .map((line, i) => `${i + 1}. ${line}`)
            .join('\n');
          break;
        case 'quote':
          formattedText = selectedText
            .split('\n')
            .map(line => `> ${line}`)
            .join('\n');
          break;
        case 'code':
          formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
          break;
        case 'link':
          formattedText = `[${selectedText}](url)`;
          break;
        case 'image':
          formattedText = `![${selectedText}](image-url)`;
          break;
        case 'table':
          formattedText = `| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |`;
          break;
        case 'clear':
          // Remove markdown formatting
          formattedText = selectedText
            .replace(/[*_~`#>]/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
          break;
      }
      
      editor.executeEdits('formatting', [{
        range: selection,
        text: formattedText
      }]);
    }
  };

  const getSelectedText = () => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      if (selection) {
        return editor.getModel()?.getValueInRange(selection) || '';
      }
    }
    return '';
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
          flexDirection: 'column',
          gap: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {/* Top Toolbar */}
        <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
          {isDirty && (
            <Chip
              label="Unsaved Changes"
              color="warning"
              size="small"
            />
          )}
        </Stack>

        {/* Editor Toolbar */}
        <Toolbar variant="dense" disableGutters sx={{ minHeight: 40 }}>
          {/* History Controls */}
          <ButtonGroup size="small" sx={{ mr: 2 }}>
            <Tooltip title="Undo (Ctrl+Z)">
              <IconButton onClick={() => editorRef.current?.trigger('', 'undo', null)}>
                <UndoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo (Ctrl+Y)">
              <IconButton onClick={() => editorRef.current?.trigger('', 'redo', null)}>
                <RedoIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Clipboard */}
          <ButtonGroup size="small" sx={{ mr: 2 }}>
            <Tooltip title="Cut (Ctrl+X)">
              <IconButton onClick={() => document.execCommand('cut')}>
                <CutIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy (Ctrl+C)">
              <IconButton onClick={() => document.execCommand('copy')}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Paste (Ctrl+V)">
              <IconButton onClick={() => document.execCommand('paste')}>
                <PasteIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Text Formatting */}
          <ButtonGroup size="small" sx={{ mr: 2 }}>
            <Tooltip title="Bold">
              <IconButton onClick={() => handleFormatText('bold')}>
                <FormatBoldIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
              <IconButton onClick={() => handleFormatText('italic')}>
                <FormatItalicIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Underline">
              <IconButton onClick={() => handleFormatText('underline')}>
                <FormatUnderlinedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Strikethrough">
              <IconButton onClick={() => handleFormatText('strikethrough')}>
                <FormatStrikethroughIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Lists */}
          <ButtonGroup size="small" sx={{ mr: 2 }}>
            <Tooltip title="Bullet List">
              <IconButton onClick={() => handleFormatText('bullet')}>
                <FormatListBulletedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Numbered List">
              <IconButton onClick={() => handleFormatText('number')}>
                <FormatListNumberedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Quote">
              <IconButton onClick={() => handleFormatText('quote')}>
                <FormatQuoteIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Insert */}
          <ButtonGroup size="small" sx={{ mr: 2 }}>
            <Tooltip title="Code Block">
              <IconButton onClick={() => handleFormatText('code')}>
                <CodeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Link">
              <IconButton onClick={() => handleFormatText('link')}>
                <LinkIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Image">
              <IconButton onClick={() => handleFormatText('image')}>
                <ImageIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Table">
              <IconButton onClick={() => handleFormatText('table')}>
                <TableIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Find & Replace */}
          <ButtonGroup size="small" sx={{ mr: 2 }}>
            <Tooltip title="Find (Ctrl+F)">
              <IconButton onClick={() => editorRef.current?.trigger('', 'actions.find', null)}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Replace (Ctrl+H)">
              <IconButton onClick={() => editorRef.current?.trigger('', 'editor.action.startFindReplaceAction', null)}>
                <FindReplaceIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          {/* Clear & AI */}
          <ButtonGroup size="small" sx={{ mr: 2 }}>
            <Tooltip title="Clear Formatting">
              <IconButton onClick={() => handleFormatText('clear')}>
                <ClearFormattingIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="AI Assistance">
              <IconButton>
                <AIIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>

          {/* Right-aligned buttons */}
          <Box sx={{ flexGrow: 1 }} />
          
          <ButtonGroup size="small">
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
                  src="https://cdn.lordicon.com/psnhyobz.json"
                  trigger="hover"
                  size={24}
                  colors={{
                    primary: "#808080",
                    secondary: "#121331"
                  }}
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="AI Settings">
              <IconButton onClick={() => setIsAISettingsOpen(true)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <IconButton onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Toolbar>
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

        <QuickActionBar
          onFormatText={handleFormatText}
          onAIAction={handleReplaceText}
          getSelectedText={getSelectedText}
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

      <AISettingsDialog
        open={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
      />
    </Box>
  );
};
