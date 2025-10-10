// Map of file extensions to languages
export const languageMap = {
  js: 'javascript', 
  jsx: 'javascript',
  py: 'python', 
  java: 'java',
  cpp: 'cpp', 
  c: 'c', 
  cs: 'csharp',
  ts: 'typescript',
  go: 'go',
  rs: 'rust',
  php: 'php',
  rb: 'ruby',
  kt: 'kotlin',
  swift: 'swift',
  html: 'html', 
  css: 'css',
  json: 'json', 
  md: 'markdown',
  sh: 'shell'
};

// Detect language from filename
export const detectLanguage = (filename) => {
  if (!filename) return 'text';
  const ext = filename.split('.').pop().toLowerCase();
  return languageMap[ext] || 'text';
};