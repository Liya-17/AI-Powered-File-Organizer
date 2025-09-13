import React from 'react';
import { Star, StarOff } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import FileList from '../components/FileList';

const Starred: React.FC = () => {
  const { state } = useApp();

  const starredFiles = state.files.filter(file => file.starred);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Starred Files</h1>
        <p className="text-gray-600 mt-1">
          Your favorite and most important files, easily accessible.
        </p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-900">
                {starredFiles.length} starred files
              </span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Total size: {formatTotalSize(starredFiles)}
          </div>
        </div>
      </div>

      {/* Starred Files */}
      {starredFiles.length > 0 ? (
        <FileList files={starredFiles} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No starred files</h3>
          <p className="text-gray-500 mb-4">
            Star files to mark them as important and access them quickly from here.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Star className="w-4 h-4" />
            <span>Click the star icon next to any file to add it here</span>
          </div>
        </div>
      )}
    </div>
  );
};

const formatTotalSize = (files: any[]): string => {
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  
  if (totalBytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(totalBytes) / Math.log(k));
  return parseFloat((totalBytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default Starred;
