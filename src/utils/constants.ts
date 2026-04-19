// File type constants
export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml'],
  VIDEO: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv'],
  AUDIO: ['audio/mp3', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg', 'audio/m4a'],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'text/markdown',
  ],
  ARCHIVE: [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/gzip',
    'application/x-tar',
  ],
} as const;

// File size limits
export const FILE_SIZE_LIMITS = {
  MAX_UPLOAD_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_IMAGE_SIZE: 10 * 1024 * 1024,   // 10MB
  MAX_VIDEO_SIZE: 500 * 1024 * 1024,  // 500MB
  MAX_AUDIO_SIZE: 50 * 1024 * 1024,   // 50MB
} as const;

// Storage limits
export const STORAGE_LIMITS = {
  FREE_TIER: 5 * 1024 * 1024 * 1024,    // 5GB
  PRO_TIER: 100 * 1024 * 1024 * 1024,   // 100GB
  ENTERPRISE_TIER: 1000 * 1024 * 1024 * 1024, // 1TB
} as const;

// API endpoints
export const API_ENDPOINTS = {
  FILES: '/files',
  UPLOAD: '/files/upload',
  SEARCH: '/files/search',
  DUPLICATES: '/files/duplicates',
  ORGANIZE: '/files/organize',
  USER: '/user',
  PROFILE: '/user/profile',
  STORAGE: '/user/storage',
  SETTINGS: '/user/settings',
  AI_CHAT: '/ai/chat',
  AI_ANALYZE: '/ai/analyze',
  AI_SUGGESTIONS: '/ai/suggestions',
  SHARING: '/sharing',
  BACKUP: '/backup',
} as const;

// UI constants
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: 256,
  HEADER_HEIGHT: 64,
  CHATBOT_WIDTH: 320,
  CHATBOT_HEIGHT: 400,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
} as const;

// Theme colors
export const THEME_COLORS = {
  PRIMARY: '#6366f1',
  SECONDARY: '#a855f7',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
} as const;

// File categories
export const FILE_CATEGORIES = [
  'Documents',
  'Images',
  'Videos',
  'Audio',
  'Archives',
  'Other',
] as const;

// Organization methods
export const ORGANIZATION_METHODS = [
  { value: 'type', label: 'By File Type' },
  { value: 'date', label: 'By Date' },
  { value: 'content', label: 'By Content Analysis' },
  { value: 'size', label: 'By File Size' },
  { value: 'name', label: 'By Name' },
] as const;

// Backup providers
export const BACKUP_PROVIDERS = [
  { value: 'google', label: 'Google Drive', icon: 'google' },
  { value: 'dropbox', label: 'Dropbox', icon: 'dropbox' },
  { value: 'onedrive', label: 'OneDrive', icon: 'microsoft' },
  { value: 'aws', label: 'AWS S3', icon: 'aws' },
] as const;

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// File permissions
export const FILE_PERMISSIONS = {
  VIEW: 'view',
  EDIT: 'edit',
  ADMIN: 'admin',
} as const;

// Sort options
export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'size', label: 'Size' },
  { value: 'date', label: 'Date Modified' },
  { value: 'type', label: 'File Type' },
] as const;

// View modes
export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list',
} as const;

// Chatbot messages
export const CHATBOT_MESSAGES = {
  WELCOME: "Hello! I'm your FileOrganizer AI assistant. How can I help you with your files today?",
  HELP: "I can help you with file organization, duplicate detection, storage optimization, cloud backup, and intelligent search. What would you like to know more about?",
  ORGANIZE: "I can help you organize your files! You can use automatic categorization based on file type, date, or content. Would you like me to set this up for you?",
  DUPLICATES: "I've found 47 duplicate files taking up 2.3 GB of space. Would you like me to show you these files and help you remove them?",
  STORAGE: "You currently have 8.2 GB of 12 GB used. I can help you free up space by identifying duplicate files or large files you might not need.",
  IMAGES: "For images, I can organize by date, detect objects or people in them, and even suggest better file names based on content.",
  BACKUP: "I can help you backup files to cloud storage. You have 327 files (4.1 GB) that aren't backed up. Would you like to set up automatic backup?",
  SEARCH: "I can help you find files using AI-powered search. You can search by content, tags, or even describe what you're looking for in natural language.",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  UPLOAD_FAILED: 'Failed to upload files. Please try again.',
  DELETE_FAILED: 'Failed to delete files. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'File type is not supported.',
  STORAGE_FULL: 'Storage is full. Please free up some space.',
  AI_SERVICE_ERROR: 'AI service is temporarily unavailable.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: 'Files uploaded successfully!',
  DELETE_SUCCESS: 'Files deleted successfully!',
  ORGANIZE_SUCCESS: 'Files organized successfully!',
  BACKUP_SUCCESS: 'Backup completed successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  SHARE_SUCCESS: 'File shared successfully!',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebarState',
  CHATBOT_STATE: 'chatbotState',
} as const;

// Regex patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  FILENAME: /^[^<>:"/\\|?*]+$/,
} as const;
