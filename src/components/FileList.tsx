import React from 'react';
import { 
  File, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Star, 
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Eye
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { FileItem } from '../contexts/AppContext';

interface FileListProps {
  files: FileItem[];
  showActions?: boolean;
}

const FileList: React.FC<FileListProps> = ({ files, showActions = true }) => {
  const { state, dispatch } = useApp();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const getFileIcon = (file: FileItem) => {
    const iconClass = "w-5 h-5";
    
    if (file.type.startsWith('image/')) {
      return <Image className={`${iconClass} text-blue-500`} />;
    }
    if (file.type.startsWith('video/')) {
      return <Video className={`${iconClass} text-purple-500`} />;
    }
    if (file.type.startsWith('audio/')) {
      return <Music className={`${iconClass} text-green-500`} />;
    }
    if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('7z')) {
      return <Archive className={`${iconClass} text-orange-500`} />;
    }
    return <File className={`${iconClass} text-gray-500`} />;
  };

  const toggleStar = (fileId: string) => {
    dispatch({ type: 'TOGGLE_STAR', payload: fileId });
  };

  const handleFileAction = (action: string, fileId: string) => {
    // Handle file actions like download, share, delete
    console.log(`${action} file:`, fileId);
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
        <p className="text-gray-500">Upload some files to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Modified
              </th>
              {showActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {file.path}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleStar(file.id)}
                      className="ml-2 p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Star 
                        className={`w-4 h-4 ${
                          file.starred ? 'text-yellow-400 fill-current' : 'text-gray-400'
                        }`} 
                      />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {file.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatFileSize(file.size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(file.lastModified)}
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleFileAction('view', file.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFileAction('download', file.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFileAction('share', file.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFileAction('delete', file.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFileAction('more', file.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileList;
