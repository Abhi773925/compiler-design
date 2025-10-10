import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';

const EditorComponent = ({ 
  code,
  setCode,
  language,
  onEditorReady,
  isRemoteChange,
  monacoRef,
}) => {
  const { theme: appTheme } = useTheme();
  const editorRef = useRef(null);

  useEffect(() => {
    if (!window.monaco) {
      // Load Monaco if not already loaded
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/monaco-editor@latest/min/vs/loader.js';
      script.async = true;
      script.onload = () => {
        window.require.config({
          paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' }
        });
      };
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (window.monaco && editorRef.current) {
      const editor = monaco.editor.create(editorRef.current, {
        value: code,
        language: language,
        theme: appTheme === 'dark' ? 'vs-dark' : 'vs-light',
        automaticLayout: true,
        minimap: { enabled: true },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: true,
        scrollBeyondLastLine: false,
        readOnly: false,
        cursorStyle: 'line'
      });

      monacoRef.current = editor;

      editor.onDidChangeModelContent((e) => {
        if (!isRemoteChange.current) {
          const newValue = editor.getValue();
          setCode(newValue);
        }
        isRemoteChange.current = false;
      });

      onEditorReady && onEditorReady();

      return () => {
        editor.dispose();
      };
    }
  }, [code, language, appTheme]);

  return (
    <div 
      ref={editorRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        overflow: 'hidden'
      }}
    />
  );
};

export default EditorComponent;