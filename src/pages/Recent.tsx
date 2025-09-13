import React from 'react';
import { Clock, Calendar, Filter } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import FileList from '../components/FileList';

const Recent: React.FC = () => {
  const { state } = useApp();

  const recentFiles = state.files
    .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - 7);

  const todayFiles = recentFiles.filter(file => 
    file.lastModified.toDateString() === today.toDateString()
  );

  const yesterdayFiles = recentFiles.filter(file => 
    file.lastModified.toDateString() === yesterday.toDateString()
  );

  const thisWeekFiles = recentFiles.filter(file => 
    file.lastModified >= thisWeek && 
    file.lastModified.toDateString() !== today.toDateString() &&
    file.lastModified.toDateString() !== yesterday.toDateString()
  );

  const olderFiles = recentFiles.filter(file => 
    file.lastModified < thisWeek
  );

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recent Files</h1>
        <p className="text-gray-600 mt-1">
          Files you've accessed recently, organized by date.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
              <Clock className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{todayFiles.length}</p>
              <p className="text-sm text-gray-600">Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{yesterdayFiles.length}</p>
              <p className="text-sm text-gray-600">Yesterday</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
              <Filter className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{thisWeekFiles.length}</p>
              <p className="text-sm text-gray-600">This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Files by Date */}
      <div className="space-y-6">
        {todayFiles.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today</h2>
            <FileList files={todayFiles} />
          </div>
        )}

        {yesterdayFiles.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Yesterday</h2>
            <FileList files={yesterdayFiles} />
          </div>
        )}

        {thisWeekFiles.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
            <FileList files={thisWeekFiles} />
          </div>
        )}

        {olderFiles.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Older</h2>
            <FileList files={olderFiles} />
          </div>
        )}

        {recentFiles.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent files</h3>
            <p className="text-gray-500">Files you access will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recent;
