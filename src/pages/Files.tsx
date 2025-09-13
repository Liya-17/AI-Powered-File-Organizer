import React, { useState } from 'react';
import { Search, Filter, Grid, List, Folder, FolderOpen } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import FileList from '../components/FileList';

const Files: React.FC = () => {
  const { state } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Files', count: state.files.length },
    { id: 'Documents', name: 'Documents', count: state.files.filter(f => f.category === 'Documents').length },
    { id: 'Images', name: 'Images', count: state.files.filter(f => f.category === 'Images').length },
    { id: 'Videos', name: 'Videos', count: state.files.filter(f => f.category === 'Videos').length },
    { id: 'Audio', name: 'Audio', count: state.files.filter(f => f.category === 'Audio').length },
    { id: 'Archives', name: 'Archives', count: state.files.filter(f => f.category === 'Archives').length },
    { id: 'Other', name: 'Other', count: state.files.filter(f => f.category === 'Other').length },
  ];

  const filteredFiles = selectedCategory === 'all' 
    ? state.files 
    : state.files.filter(file => file.category === selectedCategory);

  const searchedFiles = state.searchQuery
    ? filteredFiles.filter(file => 
        file.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()))
      )
    : filteredFiles;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Files</h1>
        <p className="text-gray-600 mt-1">
          Manage and organize all your files in one place.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Filter</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Categories */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {selectedCategory === category.id ? (
                      <FolderOpen className="w-4 h-4" />
                    ) : (
                      <Folder className="w-4 h-4" />
                    )}
                    <span>{category.name}</span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {searchedFiles.length > 0 ? (
            <FileList files={searchedFiles} />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-500">
                {state.searchQuery 
                  ? 'Try adjusting your search terms or filters'
                  : 'Upload some files to get started'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Files;
