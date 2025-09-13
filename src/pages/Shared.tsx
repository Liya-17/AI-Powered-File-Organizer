import React from 'react';
import { Share2, Link, Users, Clock, Eye } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Shared: React.FC = () => {
  const { state } = useApp();

  // Mock shared files data
  const sharedFiles = [
    {
      id: '1',
      name: 'Project_Design.png',
      type: 'image/png',
      size: 2.8 * 1024 * 1024,
      sharedWith: ['john@example.com', 'sarah@example.com'],
      sharedBy: 'You',
      sharedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      permissions: 'view',
      link: 'https://fileorganizer.ai/shared/abc123',
    },
    {
      id: '2',
      name: 'Meeting_Notes.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: 1.2 * 1024 * 1024,
      sharedWith: ['team@company.com'],
      sharedBy: 'You',
      sharedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      permissions: 'edit',
      link: 'https://fileorganizer.ai/shared/def456',
    },
  ];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shared Files</h1>
        <p className="text-gray-600 mt-1">
          Files you've shared with others and files shared with you.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
              <Share2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{sharedFiles.length}</p>
              <p className="text-sm text-gray-600">Files Shared</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {sharedFiles.reduce((sum, file) => sum + file.sharedWith.length, 0)}
              </p>
              <p className="text-sm text-gray-600">People Shared With</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
              <Link className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{sharedFiles.length}</p>
              <p className="text-sm text-gray-600">Active Links</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Files List */}
      {sharedFiles.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Shared Files</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shared With
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shared
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sharedFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <Share2 className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{file.sharedWith.length} people</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        file.permissions === 'edit' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {file.permissions === 'edit' ? 'Can Edit' : 'View Only'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(file.sharedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-primary-600 hover:text-primary-700 transition-colors">
                          <Link className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-red-400 hover:text-red-600 transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shared files</h3>
          <p className="text-gray-500 mb-4">
            Share files with others to collaborate and work together.
          </p>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Share a File
          </button>
        </div>
      )}
    </div>
  );
};

export default Shared;
