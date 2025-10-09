import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

const MonacoCodeEditor = ({ code, onChange, language = "javascript" }) => {
  const editorRef = useRef(null);
  const [theme, setTheme] = useState("vs");

  const getMonacoLanguage = (lang) => {
    const languageMap = {
      javascript: "javascript",
      cpp: "cpp",
      java: "java",
      python: "python",
      c: "c",
    };
    return languageMap[lang] || "javascript";
  };

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "vs-dark" : "vs");
    };

    checkDarkMode();

    // Listen for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Configure JavaScript/TypeScript settings to disable errors
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      noSuggestionDiagnostics: true,
    });

    // Disable Java diagnostics
    if (monaco.languages.java) {
      monaco.languages.java.setDiagnosticsOptions?.({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });
    }

    // Configure compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2015,
      allowNonTsExtensions: true,
      noLib: true,
      skipLibCheck: true,
    });

    // Focus the editor
    editor.focus();
  };

  const handleEditorChange = (value) => {
    onChange(value || "");
  };

  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: "line",
    automaticLayout: true,
    fontSize: 14,
    fontFamily:
      "JetBrains Mono, Fira Code, Monaco, Menlo, Ubuntu Mono, monospace",
    lineHeight: 22,
    minimap: {
      enabled: false,
    },
    scrollBeyondLastLine: false,
    wordWrap: "on",
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    folding: true,
    lineNumbers: "on",
    glyphMargin: false,
    renderLineHighlight: "line",
    contextmenu: true,
    mouseWheelZoom: true,
    smoothScrolling: true,
    cursorBlinking: "blink",
    cursorSmoothCaretAnimation: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: "on",
    tabCompletion: "on",
    wordBasedSuggestions: true,
    parameterHints: {
      enabled: true,
    },
    autoIndent: "advanced",
    formatOnPaste: true,
    formatOnType: true,
    bracketPairColorization: {
      enabled: true,
    },
    guides: {
      bracketPairs: true,
      indentation: true,
    },
  };

  return (
    <div className="h-full w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={getMonacoLanguage(language)}
        language={getMonacoLanguage(language)}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={options}
        theme={theme}
      />
    </div>
  );
};

export default MonacoCodeEditor;
