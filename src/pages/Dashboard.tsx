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
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="animate-slideInDown">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Welcome back, {state.user.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Here's what's happening with your files today. You have <span className="font-semibold text-primary-600">{state.files.length}</span> files in your collection.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name} 
              className="group bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-slideInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.bgColor} rounded-xl flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">{stat.count}</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">{stat.name}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Suggestions */}
      <div className="animate-slideInUp">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse"></span>
            Smart Suggestions
          </h2>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:scale-105 transition-transform duration-200">
            View All →
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div 
                key={suggestion.title} 
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg hover:scale-102 transition-all duration-300 animate-slideInUp"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${suggestion.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${suggestion.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">{suggestion.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed">{suggestion.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md self-start">{suggestion.size}</span>
                      <button className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs sm:text-sm font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md">
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
      <div className="animate-slideInUp">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
            Recently Added Files
          </h2>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:scale-105 transition-transform duration-200">
            View All →
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <FileList files={recentFiles} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
