import React from 'react';
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  Copy,
  Clock,
  FileArchive,
  Cloud
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';

const Dashboard: React.FC = () => {
  const { state } = useApp();

  const stats = [
    {
      name: 'Documents',
      count: state.files.filter(f => f.category === 'Documents').length,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Images',
      count: state.files.filter(f => f.category === 'Images').length,
      icon: Image,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Videos',
      count: state.files.filter(f => f.category === 'Videos').length,
      icon: Video,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Audio',
      count: state.files.filter(f => f.category === 'Audio').length,
      icon: Music,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      name: 'Other',
      count: state.files.filter(f => f.category === 'Other').length,
      icon: Archive,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
    },
  ];

  const suggestions = [
    {
      title: 'Remove Duplicates',
      description: 'We found 47 duplicate files that are taking up 2.3 GB of space. You can safely delete these files.',
      icon: Copy,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      size: '2.3 GB',
      action: 'Clean Up',
    },
    {
      title: 'Unused Files',
      description: '132 files haven\'t been accessed in over 6 months. Consider archiving or deleting them.',
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      size: '5.7 GB',
      action: 'Review',
    },
    {
      title: 'Extracted Archives',
      description: 'You have 8 extracted archive folders. The original ZIP files are still available.',
      icon: FileArchive,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      size: '1.8 GB',
      action: 'Remove',
    },
    {
      title: 'Google Drive Backup',
      description: '327 files aren\'t backed up to Google Drive. Secure your files with cloud backup.',
      icon: Cloud,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      size: '4.1 GB',
      action: 'Backup',
    },
  ];

  const recentFiles = state.files
    .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {state.user.name}!</h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your files today. You have {state.files.length} files in your collection.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Suggestions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Smart Suggestions</h2>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon;
            return (
              <div key={suggestion.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 ${suggestion.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${suggestion.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{suggestion.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{suggestion.size}</span>
                      <button className="px-3 py-1 bg-primary-600 text-white text-xs rounded-md hover:bg-primary-700 transition-colors">
                        {suggestion.action}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* File Upload */}
      <FileUpload />

      {/* Recent Files */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recently Added Files</h2>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All →
          </button>
        </div>
        <FileList files={recentFiles} />
      </div>
    </div>
  );
};

export default Dashboard;
