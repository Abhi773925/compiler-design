import React, { useEffect, useState, useRef } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";

// Import CodeMirror styles and modes (JavaScript only)
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material-darker.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/selection/active-line";

const CodeEditor = ({ code, onChange, language = "javascript" }) => {
  const [isDark, setIsDark] = useState(false);
  const [editorValue, setEditorValue] = useState(code || "");
  const editorRef = useRef(null);

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
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

  useEffect(() => {
    setEditorValue(code || "");
  }, [code]);

  const handleEditorChange = (editor, data, value) => {
    setEditorValue(value);
    onChange(value);
  };

  const options = {
    mode: "javascript",
    theme: isDark ? "material-darker" : "default",
    lineNumbers: true,
    lineWrapping: false,
    autoCloseBrackets: true,
    matchBrackets: true,
    styleActiveLine: true,
    readOnly: false,
    cursorBlinkRate: 530,
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false,
    smartIndent: true,
    electricChars: true,
    showCursorWhenSelecting: true,
    viewportMargin: Infinity,
    extraKeys: {
      Tab: (cm) => {
        if (cm.somethingSelected()) {
          cm.indentSelection("add");
        } else {
          cm.replaceSelection("  ", "end");
        }
      },
      "Shift-Tab": (cm) => {
        cm.indentSelection("subtract");
      },
    },
  };

  return (
    <div className="h-full w-full">
      <style jsx global>{`
        .CodeMirror {
          height: 100% !important;
          font-family: "JetBrains Mono", "Fira Code", "Monaco", "Menlo",
            "Ubuntu Mono", monospace;
          font-size: 14px;
          line-height: 1.5;
          border-radius: 8px;
        }

        .CodeMirror-scroll {
          padding: 12px;
        }

        .CodeMirror-gutters {
          border-right: 1px solid ${isDark ? "#374151" : "#e5e7eb"};
          background: ${isDark ? "#1f2937" : "#f9fafb"};
        }

        .CodeMirror-linenumber {
          color: ${isDark ? "#9ca3af" : "#6b7280"};
          padding: 0 8px;
        }

        .CodeMirror-activeline-background {
          background: ${isDark ? "#374151" : "#f3f4f6"};
        }

        .CodeMirror-cursor {
          border-left: 2px solid #f97316;
        }

        .CodeMirror-selected {
          background: ${isDark ? "#4b5563" : "#ddd6fe"};
        }

        .CodeMirror-focused .CodeMirror-selected {
          background: ${isDark ? "#374151" : "#e0e7ff"};
        }
      `}</style>

      <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        <CodeMirror
          value={editorValue}
          options={options}
          onBeforeChange={handleEditorChange}
          editorDidMount={(editor) => {
            editorRef.current = editor;
            // Ensure editor is properly initialized
            setTimeout(() => {
              editor.refresh();
              editor.focus();
              // Position cursor at the end
              const doc = editor.getDoc();
              const lastLine = doc.lastLine();
              const line = doc.getLine(lastLine);
              doc.setCursor(lastLine, line.length);
            }, 50);
          }}
          editorWillUnmount={() => {
            editorRef.current = null;
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
