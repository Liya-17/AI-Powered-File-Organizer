import { useState, useEffect, useCallback } from 'react';
import { fileApi, userApi, aiApi, sharingApi, settingsApi, backupApi } from '../services/api';

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// File-related hooks
export function useFiles(params?: any) {
  return useApi(() => fileApi.getFiles(params), [JSON.stringify(params)]);
}

export function useFile(id: string) {
  return useApi(() => fileApi.getFile(id), [id]);
}

export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFiles = useCallback(async (files: File[]) => {
    setUploading(true);
    setProgress(0);
    
    try {
      const result = await fileApi.uploadFiles(files, (progress) => {
        setProgress(progress.percentage);
      });
      return result;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, []);

  return { uploadFiles, uploading, progress };
}

export function useFileSearch() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await fileApi.searchFiles(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  }, []);

  return { searchResults, searching, search };
}

export function useDuplicates() {
  return useApi(() => fileApi.getDuplicates());
}

// User-related hooks
export function useUserProfile() {
  return useApi(() => userApi.getProfile());
}

export function useStorageUsage() {
  return useApi(() => userApi.getStorageUsage());
}

// AI-related hooks
export function useAIChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  const sendMessage = useCallback(async (message: string, context?: any) => {
    setSending(true);
    try {
      const response = await aiApi.chat(message, context);
      setMessages(prev => [
        ...prev,
        { type: 'user', content: message },
        { type: 'bot', content: response.response, suggestions: response.suggestions }
      ]);
      return response;
    } finally {
      setSending(false);
    }
  }, []);

  return { messages, sending, sendMessage };
}

export function useAISuggestions() {
  return useApi(() => aiApi.getSuggestions());
}

export function useFileAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);

  const analyzeFile = useCallback(async (fileId: string) => {
    setAnalyzing(true);
    try {
      const result = await aiApi.analyzeFile(fileId);
      return result;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  return { analyzeFile, analyzing };
}

// Sharing hooks
export function useSharedFiles() {
  return useApi(() => sharingApi.getSharedFiles());
}

export function useFileSharing() {
  const [sharing, setSharing] = useState(false);

  const shareFile = useCallback(async (fileId: string, options: any) => {
    setSharing(true);
    try {
      const result = await sharingApi.shareFile(fileId, options);
      return result;
    } finally {
      setSharing(false);
    }
  }, []);

  return { shareFile, sharing };
}

// Settings hooks
export function useSettings() {
  return useApi(() => settingsApi.getSettings());
}

export function useBackupStatus() {
  return useApi(() => backupApi.getBackupStatus());
}

// Utility hooks
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}
