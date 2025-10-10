// Language detection and mapping utilities
export const extensionToLanguage = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  cs: 'csharp',
  html: 'html',
  css: 'css',
  json: 'json',
  md: 'markdown',
  txt: 'text',
  sql: 'sql',
  php: 'php',
  rb: 'ruby',
  rs: 'rust',
  go: 'go',
  swift: 'swift',
  kt: 'kotlin',
  scala: 'scala',
};

export function detectLanguage(filename) {
  if (!filename) return 'text';
  const fileExtension = filename.split('.').pop().toLowerCase();
  return extensionToLanguage[fileExtension] || 'text';
}