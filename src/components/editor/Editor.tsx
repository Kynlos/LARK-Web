import React from 'react';
import { useEffect, useRef, useCallback, useState } from 'react';
import { Box, CircularProgress, Snackbar } from '@mui/material';
import Editor, { OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useEditorStore } from '../../stores/editorStore';
import { useAuthStore } from '../../stores/authStore';
import { registerCasebookLanguage } from '../../languages/casebook';

export const CodeEditor = () => {
  const {
    activeFile,
    editorInstance,
    setEditorInstance,
    updateFileContent,
    saveFile,
    isDirty
  } = useEditorStore();
  
  const { user } = useAuthStore();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const languagesRegistered = useRef(false);

  const handleSave = useCallback(async () => {
    if (activeFile && isDirty(activeFile.id)) {
      setSaving(true);
      try {
        await saveFile(activeFile.id);
        setSaveError(null);
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : 'Failed to save file');
      } finally {
        setSaving(false);
      }
    }
  }, [activeFile, isDirty, saveFile]);

  const getLanguage = useCallback((filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'case') return 'casebook';
    return undefined; // Let Monaco auto-detect
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    setEditorInstance(editor);

    // Register custom languages if not already registered
    if (!languagesRegistered.current) {
      registerCasebookLanguage();
      languagesRegistered.current = true;
    }

    // Configure editor based on user preferences
    if (user?.preferences.editorSettings) {
      const settings = user.preferences.editorSettings;
      editor.updateOptions({
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        tabSize: settings.tabSize,
        renderWhitespace: settings.showLineNumbers ? 'all' : 'none',
        lineNumbers: settings.showLineNumbers ? 'on' : 'off',
        minimap: {
          enabled: true
        },
        automaticLayout: true,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        formatOnPaste: true,
        formatOnType: true
      });
    }

    // Add custom commands
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, handleSave);

    // Add custom keybindings
    if (user?.preferences.customKeybindings) {
      Object.entries(user.preferences.customKeybindings).forEach(([key, command]) => {
        // TODO: Implement custom keybinding logic
      });
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFile) {
      updateFileContent(activeFile.id, value);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (activeFile && isDirty(activeFile.id)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeFile, isDirty]);

  useEffect(() => {
    if (editorInstance && user?.preferences.editorSettings) {
      const settings = user.preferences.editorSettings;
      editorInstance.updateOptions({
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        tabSize: settings.tabSize,
        renderWhitespace: settings.showLineNumbers ? 'all' : 'none',
        lineNumbers: settings.showLineNumbers ? 'on' : 'off',
        cursorSmoothCaretAnimation: 'on'
      });
    }
  }, [editorInstance, user?.preferences.editorSettings]);

  if (!activeFile) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
        No file selected
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <Editor
        height="100%"
        defaultLanguage="plaintext"
        language={activeFile ? getLanguage(activeFile.name) : undefined}
        value={activeFile?.content || ''}
        onChange={(value) => {
          if (value !== undefined && activeFile) {
            updateFileContent(activeFile.id, value);
          }
        }}
        onMount={handleEditorDidMount}
        theme={user?.preferences.theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          readOnly: saving
        }}
      />
      {saving && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CircularProgress size={20} />
        </Box>
      )}
      <Snackbar
        open={saveError !== null}
        autoHideDuration={6000}
        onClose={() => setSaveError(null)}
        message={saveError}
      />
    </Box>
  );
};
