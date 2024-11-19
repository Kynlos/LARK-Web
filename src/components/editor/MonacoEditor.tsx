import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { Box } from '@mui/material';

interface MonacoEditorProps {
  value: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  language = 'plaintext',
  readOnly = false,
  onChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
        scrollBeyondLastLine: false,
        readOnly,
        fontSize: 14,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
        },
      });

      if (onChange) {
        monacoEditorRef.current.onDidChangeModelContent(() => {
          onChange(monacoEditorRef.current?.getValue() || '');
        });
      }
    }

    return () => {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (monacoEditorRef.current) {
      const currentValue = monacoEditorRef.current.getValue();
      if (currentValue !== value) {
        monacoEditorRef.current.setValue(value);
      }
    }
  }, [value]);

  return (
    <Box
      ref={editorRef}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '300px',
        '& .monaco-editor': {
          paddingTop: 1,
        },
      }}
    />
  );
};
