import React, { useState } from 'react';

const CodeExecutor = ({ language, monacoRef, setIsRunning, setOutput, setShowOutput }) => {
  const [customInput, setCustomInput] = useState('');

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      csharp: "cs",
      typescript: "ts",
      go: "go",
      rust: "rs",
      php: "php",
      ruby: "rb",
      kotlin: "kt",
      swift: "swift",
      r: "r",
      sql: "sql",
    };
    return extensions[lang] || "txt";
  };

  const languageMappings = {
    javascript: "javascript",
    python: "python",
    java: "java",
    cpp: "c++",
    c: "c",
    csharp: "csharp",
    typescript: "typescript",
    go: "go",
    rust: "rust",
    php: "php",
    ruby: "ruby",
    kotlin: "kotlin",
    swift: "swift",
    r: "r",
    sql: "sqlite3",
  };

  const runCode = async () => {
    if (!monacoRef.current) return;

    setIsRunning(true);
    setOutput("Running code...");
    setShowOutput(true);

    const currentCode = monacoRef.current.getValue();

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: languageMappings[language] || language,
          version: "*",
          files: [
            {
              name: `main.${getFileExtension(language)}`,
              content: currentCode,
            },
          ],
          stdin: customInput,
          args: [],
          compile_timeout: 10000,
          run_timeout: 3000,
          compile_memory_limit: -1,
          run_memory_limit: -1,
        }),
      });

      const data = await response.json();

      if (data.compile && data.compile.code !== 0) {
        setOutput(`Compilation Error:\n${data.compile.stderr || data.compile.output || "Unknown compilation error"}`);
      } else if (data.run) {
        let output = "";

        if (data.run.stdout) {
          output += data.run.stdout;
        }

        if (data.run.stderr) {
          if (output) output += "\n\n--- Errors/Warnings ---\n";
          output += data.run.stderr;
        }

        if (!output) {
          output = "Program executed successfully with no output";
        }

        setOutput(output);
      } else if (data.message) {
        setOutput(`Error: ${data.message}`);
      } else {
        setOutput("No output generated");
      }
    } catch (error) {
      setOutput(`Error: ${error.message || "Failed to execute code"}`);
    } finally {
      setIsRunning(false);
    }
  };

  return { runCode, setCustomInput, customInput };
};

export default CodeExecutor;