import React from 'react';
import { Trash2, RotateCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Trash: React.FC = () => {
  const { state } = useApp();

  // In a real app, you'd have a separate trash/deleted files array
  const deletedFiles: any[] = []; // This would come from your state

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trash</h1>
        <p className="text-gray-600 mt-1">
          Files you've deleted. They'll be permanently removed after 30 days.
        </p>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Trash is empty</h3>
        <p className="text-gray-500 mb-4">
          Deleted files will appear here and can be restored within 30 days.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Trash2 className="w-4 h-4" />
          <span>Files are automatically deleted after 30 days</span>
        </div>
      </div>

      {/* If there were deleted files, you'd show them here */}
      {deletedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Deleted Files</h2>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <RotateCcw className="w-4 h-4" />
                <span>Restore All</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                <Trash2 className="w-4 h-4" />
                <span>Empty Trash</span>
              </button>
            </div>
          </div>
          
          {/* File list would go here */}
        </div>
      )}
    </div>
  );
};

export default Trash;
