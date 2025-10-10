import React from 'react';
import { detectLanguage } from '../FileFunctions';
import { saveFileToDatabase } from '../../../services/fileService';

const FileManager = ({
  user,
  files,
  setFiles,
  activeFileId,
  setActiveFileId,
  monacoRef,
  setCode,
  setLanguage,
  setOutput,
  setShowOutput,
  isRemoteChange
}) => {
  // Store file locally
  const storeFileLocally = (file) => {
    if (!file?.name || !file?.content) return false;
    
    const storeData = {
      ...file,
      timestamp: Date.now(),
      lastModified: Date.now()
    };

    try {
      const serialized = JSON.stringify(storeData);
      sessionStorage.setItem(`file_${file.name}`, serialized);
      localStorage.setItem(`file_${file.name}`, serialized);
      return true;
    } catch (err) {
      console.warn('File storage failed:', err);
      return false;
    }
  };

  // Load from storage
  const loadFromStorage = (name, storage) => {
    try {
      const data = storage.getItem(`file_${name}`);
      if (!data) return null;

      const parsed = JSON.parse(data);
      const age = Date.now() - (parsed.timestamp || 0);
      const maxAge = storage === sessionStorage ? 300000 : 3600000;

      return age < maxAge ? parsed : null;
    } catch (err) {
      console.warn(`Storage load failed:`, err);
      return null;
    }
  };

  // Save file with retry
  const saveFileWithRetry = async (file, source) => {
    if (!user?.id) return null;

    const saveAttempt = async () => {
      const metadata = {
        type: file.type || 'text/plain',
        lastModified: new Date().toISOString(),
        source: source,
        createdBy: user.id
      };

      return await saveFileToDatabase({
        name: file.name,
        content: file.content,
        source: source,
        metadata: metadata
      });
    };

    try {
      const savedFile = await saveAttempt();
      if (savedFile) {
        console.log('File saved to database:', savedFile);
        return savedFile;
      }
    } catch (error) {
      console.error('Initial save failed:', error);
      setOutput('Retrying save...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const savedFile = await saveAttempt();
        if (savedFile) {
          console.log('File saved on retry:', savedFile);
          return savedFile;
        }
      } catch (retryError) {
        console.error('Retry failed:', retryError);
        throw retryError;
      }
    }
    return null;
  };

  // Update editor state
  const updateEditorState = (file, source) => {
    setFiles(prev => ({
      ...prev,
      [file.name]: {
        ...file,
        source,
        lastAccessed: new Date().toISOString()
      }
    }));

    setActiveFileId(file.name);

    if (monacoRef.current) {
      isRemoteChange.current = true;
      monacoRef.current.setValue(file.content);
      setCode(file.content);
    }

    const detectedLang = detectLanguage(file.name);
    setLanguage(detectedLang);

    setOutput(`File "${file.name}" loaded successfully from ${source}`);
  };

  return null; // This is a logic-only component
};

export default FileManager;