import React, { useState } from "react";

const CodeExecutor = ({
  language,
  monacoRef,
  setIsRunning,
  setOutput,
  setShowOutput,
}) => {
  const [customInput, setCustomInput] = useState("");

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

  // Backend API URL - use localhost when running locally
  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api/problems"
      : "https://compiler-design.onrender.com/api/problems";

  const runCode = async () => {
    if (!monacoRef.current) return;

    setIsRunning(true);
    setOutput("Running code...");
    setShowOutput(true);

    const currentCode = monacoRef.current.getValue();

    try {
      const response = await fetch(`${API_URL}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: language,
          code: currentCode,
          input: customInput,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const output = data.output.trim();
        if (!output) {
          setOutput("Program executed successfully with no output");
        } else {
          setOutput(output);
        }
      } else {
        setOutput(data.output || data.error || "Execution failed");
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
