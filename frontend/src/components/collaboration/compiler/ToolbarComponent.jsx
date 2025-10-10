import React from 'react';

const ToolbarComponent = ({
  language,
  setLanguage,
  isRunning,
  runCode,
  copyCode,
  shareLink,
  openGitHubModal,
}) => {
  const languageOptions = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
    { id: "java", name: "Java" },
    { id: "cpp", name: "C++" },
    { id: "c", name: "C" },
    { id: "csharp", name: "C#" },
    { id: "typescript", name: "TypeScript" },
    { id: "go", name: "Go" },
    { id: "rust", name: "Rust" },
    { id: "php", name: "PHP" },
    { id: "ruby", name: "Ruby" },
    { id: "kotlin", name: "Kotlin" },
    { id: "swift", name: "Swift" },
    { id: "r", name: "R" },
    { id: "sql", name: "SQL" },
  ];

  return (
    <div className="flex items-center justify-between p-2 bg-gray-800 text-white">
      <div className="flex items-center space-x-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-700 text-white rounded px-2 py-1"
        >
          {languageOptions.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
        
        <button
          onClick={runCode}
          disabled={isRunning}
          className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded disabled:opacity-50"
        >
          {isRunning ? "Running..." : "Run"}
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={copyCode}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
        >
          Copy
        </button>
        <button
          onClick={shareLink}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
        >
          Share
        </button>
        <button
          onClick={openGitHubModal}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
        >
          GitHub
        </button>
      </div>
    </div>
  );
};

export default ToolbarComponent;