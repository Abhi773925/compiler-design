import React, { useState, useRef, useEffect } from "react";

const SimpleCodeEditor = ({ code, onChange, language = "javascript" }) => {
  const [value, setValue] = useState(code || "");
  const textareaRef = useRef(null);
  const lineNumberRef = useRef(null);

  useEffect(() => {
    setValue(code || "");
  }, [code]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue);
    updateLineNumbers(newValue);
  };

  const updateLineNumbers = (text) => {
    if (lineNumberRef.current) {
      const lines = text.split("\n").length;
      const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1).join(
        "\n"
      );
      lineNumberRef.current.textContent = lineNumbers;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert 2 spaces for tab
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      setValue(newValue);
      onChange(newValue);
      updateLineNumbers(newValue);

      // Move cursor
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleScroll = () => {
    if (lineNumberRef.current && textareaRef.current) {
      lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    // Auto-focus the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
      updateLineNumbers(value);
    }
  }, []);

  useEffect(() => {
    updateLineNumbers(value);
  }, [value]);

  return (
    <div className="h-full w-full">
      <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 flex">
        {/* Line Numbers */}
        <pre
          ref={lineNumberRef}
          className="flex-none w-12 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 text-sm text-right p-2 pt-4 font-mono overflow-hidden select-none"
          style={{
            fontFamily:
              '"JetBrains Mono", "Fira Code", "Monaco", "Menlo", "Ubuntu Mono", monospace',
            fontSize: "13px",
            lineHeight: "1.5",
            userSelect: "none",
          }}
        >
          1
        </pre>

        {/* Code Editor */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          className="flex-1 p-4 pt-4 font-mono text-sm bg-transparent text-gray-900 dark:text-gray-100 border-none outline-none resize-none"
          style={{
            fontFamily:
              '"JetBrains Mono", "Fira Code", "Monaco", "Menlo", "Ubuntu Mono", monospace',
            fontSize: "14px",
            lineHeight: "1.5",
            tabSize: 2,
          }}
          placeholder="// Write your JavaScript code here..."
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default SimpleCodeEditor;
