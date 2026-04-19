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
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="animate-slideInDown">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          My Files 📁
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Manage and organize all your files in one place. You have <span className="font-semibold text-primary-600">{state.files.length}</span> files.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-slideInUp">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search files..."
                className="pl-10 pr-4 py-3 w-64 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all duration-200 shadow-sm focus:shadow-md"
              />
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl hover:from-primary-50 hover:to-primary-100 hover:border-primary-200 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Filter</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Categories */}
        <div className="lg:w-72">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-slideInLeft">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse"></span>
              Categories
            </h3>
            <nav className="space-y-2">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-all duration-200 hover:scale-102 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-r-4 border-primary-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    {selectedCategory === category.id ? (
                      <FolderOpen className="w-5 h-5 text-primary-600" />
                    ) : (
                      <Folder className="w-5 h-5" />
                    )}
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-semibold">
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
            <div className="animate-slideInRight">
              <FileList files={searchedFiles} />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center animate-slideInUp">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Folder className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No files found</h3>
              <p className="text-gray-500 text-lg">
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
