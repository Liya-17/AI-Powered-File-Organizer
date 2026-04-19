import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: Date;
  category: string;
  tags: string[];
  starred: boolean;
  path: string;
  thumbnail?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  storageUsed: number;
  storageTotal: number;
}

export interface AppState {
  user: User;
  files: FileItem[];
  isLoading: boolean;
  sidebarOpen: boolean;
  searchQuery: string;
  selectedFiles: string[];
  currentPath: string;
  chatbotOpen: boolean;
}

// Actions
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_FILES'; payload: FileItem[] }
  | { type: 'ADD_FILES'; payload: FileItem[] }
  | { type: 'UPDATE_FILE'; payload: FileItem }
  | { type: 'DELETE_FILES'; payload: string[] }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_FILES'; payload: string[] }
  | { type: 'SET_CURRENT_PATH'; payload: string }
  | { type: 'TOGGLE_CHATBOT' }
  | { type: 'TOGGLE_STAR'; payload: string };

// Initial state
const initialState: AppState = {
  user: {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    storageUsed: 8.2,
    storageTotal: 12,
  },
  files: [
    {
      id: '1',
      name: 'Quarterly_Report_2023.pdf',
      type: 'application/pdf',
      size: 4.2 * 1024 * 1024,
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: 'Documents',
      tags: ['report', 'quarterly', 'business'],
      starred: false,
      path: '/Documents/Reports',
    },
    {
      id: '2',
      name: 'Project_Design.png',
      type: 'image/png',
      size: 2.8 * 1024 * 1024,
      lastModified: new Date(Date.now() - 5 * 60 * 60 * 1000),
      category: 'Images',
      tags: ['design', 'project', 'ui'],
      starred: true,
      path: '/Images/Projects',
    },
    {
      id: '3',
      name: 'Product_Demo.mp4',
      type: 'video/mp4',
      size: 42.5 * 1024 * 1024,
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000),
      category: 'Videos',
      tags: ['demo', 'product', 'marketing'],
      starred: false,
      path: '/Videos/Demos',
    },
    {
      id: '4',
      name: 'Meeting_Notes.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 1.2 * 1024 * 1024,
      lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      category: 'Documents',
      tags: ['meeting', 'notes', 'work'],
      starred: false,
      path: '/Documents/Meetings',
    },
    {
      id: '5',
      name: 'Interview_Recording.mp3',
      type: 'audio/mpeg',
      size: 18.7 * 1024 * 1024,
      lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      category: 'Audio',
      tags: ['interview', 'recording', 'hr'],
      starred: false,
      path: '/Audio/Interviews',
    },
  ],
  isLoading: false,
  sidebarOpen: true,
  searchQuery: '',
  selectedFiles: [],
  currentPath: '/',
  chatbotOpen: false,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_FILES':
      return { ...state, files: action.payload };
    
    case 'ADD_FILES':
      return { ...state, files: [...state.files, ...action.payload] };
    
    case 'UPDATE_FILE':
      return {
        ...state,
        files: state.files.map(file =>
          file.id === action.payload.id ? action.payload : file
        ),
      };
    
    case 'DELETE_FILES':
      return {
        ...state,
        files: state.files.filter(file => !action.payload.includes(file.id)),
        selectedFiles: [],
      };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_SELECTED_FILES':
      return { ...state, selectedFiles: action.payload };
    
    case 'SET_CURRENT_PATH':
      return { ...state, currentPath: action.payload };
    
    case 'TOGGLE_CHATBOT':
      return { ...state, chatbotOpen: !state.chatbotOpen };
    
    case 'TOGGLE_STAR':
      return {
        ...state,
        files: state.files.map(file =>
          file.id === action.payload
            ? { ...file, starred: !file.starred }
            : file
        ),
      };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
