import axios from 'axios';
import { FileItem, User } from '../contexts/AppContext';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// File API
export const fileApi = {
  // Get all files
  getFiles: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<FileItem>> => {
    const response = await api.get('/files', { params });
    return response.data;
  },

  // Get file by ID
  getFile: async (id: string): Promise<FileItem> => {
    const response = await api.get(`/files/${id}`);
    return response.data;
  },

  // Upload files
  uploadFiles: async (
    files: File[],
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileItem[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          });
        }
      },
    });

    return response.data;
  },

  // Update file
  updateFile: async (id: string, updates: Partial<FileItem>): Promise<FileItem> => {
    const response = await api.put(`/files/${id}`, updates);
    return response.data;
  },

  // Delete files
  deleteFiles: async (ids: string[]): Promise<void> => {
    await api.delete('/files', { data: { ids } });
  },

  // Star/unstar file
  toggleStar: async (id: string): Promise<FileItem> => {
    const response = await api.patch(`/files/${id}/star`);
    return response.data;
  },

  // Get file categories
  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/files/categories');
    return response.data;
  },

  // Search files
  searchFiles: async (query: string): Promise<FileItem[]> => {
    const response = await api.get('/files/search', { params: { q: query } });
    return response.data;
  },

  // Get duplicate files
  getDuplicates: async (): Promise<FileItem[][]> => {
    const response = await api.get('/files/duplicates');
    return response.data;
  },

  // Organize files with AI
  organizeFiles: async (options?: {
    method?: 'type' | 'date' | 'content';
    autoMove?: boolean;
  }): Promise<{ organized: number; suggestions: any[] }> => {
    const response = await api.post('/files/organize', options);
    return response.data;
  },
};

// User API
export const userApi = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const response = await api.put('/user/profile', updates);
    return response.data;
  },

  // Get storage usage
  getStorageUsage: async (): Promise<{
    used: number;
    total: number;
    breakdown: { category: string; size: number }[];
  }> => {
    const response = await api.get('/user/storage');
    return response.data;
  },
};

// AI API
export const aiApi = {
  // Chat with AI assistant
  chat: async (message: string, context?: any): Promise<{
    response: string;
    suggestions?: any[];
  }> => {
    const response = await api.post('/ai/chat', { message, context });
    return response.data;
  },

  // Analyze file content
  analyzeFile: async (fileId: string): Promise<{
    tags: string[];
    category: string;
    summary?: string;
  }> => {
    const response = await api.post(`/ai/analyze/${fileId}`);
    return response.data;
  },

  // Generate file suggestions
  getSuggestions: async (): Promise<{
    duplicates: any[];
    unused: any[];
    large: any[];
    organize: any[];
  }> => {
    const response = await api.get('/ai/suggestions');
    return response.data;
  },

  // Auto-organize files
  autoOrganize: async (options?: {
    method?: 'type' | 'date' | 'content';
    preview?: boolean;
  }): Promise<{
    preview?: any[];
    organized?: number;
  }> => {
    const response = await api.post('/ai/organize', options);
    return response.data;
  },
};

// Sharing API
export const sharingApi = {
  // Share file
  shareFile: async (fileId: string, options: {
    emails?: string[];
    permissions: 'view' | 'edit';
    expiresAt?: Date;
  }): Promise<{ link: string; shareId: string }> => {
    const response = await api.post(`/files/${fileId}/share`, options);
    return response.data;
  },

  // Get shared files
  getSharedFiles: async (): Promise<any[]> => {
    const response = await api.get('/files/shared');
    return response.data;
  },

  // Revoke share
  revokeShare: async (shareId: string): Promise<void> => {
    await api.delete(`/shares/${shareId}`);
  },
};

// Settings API
export const settingsApi = {
  // Get user settings
  getSettings: async (): Promise<any> => {
    const response = await api.get('/user/settings');
    return response.data;
  },

  // Update settings
  updateSettings: async (settings: any): Promise<any> => {
    const response = await api.put('/user/settings', settings);
    return response.data;
  },
};

// Backup API
export const backupApi = {
  // Get backup status
  getBackupStatus: async (): Promise<{
    enabled: boolean;
    lastBackup?: Date;
    nextBackup?: Date;
    provider?: string;
  }> => {
    const response = await api.get('/backup/status');
    return response.data;
  },

  // Configure backup
  configureBackup: async (config: {
    provider: 'google' | 'dropbox' | 'onedrive';
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  }): Promise<void> => {
    await api.post('/backup/configure', config);
  },

  // Start backup
  startBackup: async (): Promise<{ jobId: string }> => {
    const response = await api.post('/backup/start');
    return response.data;
  },
};

export default api;
