import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Image, Video, Music, Archive } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import toast from 'react-hot-toast';

const FileUpload: React.FC = () => {
  const { dispatch } = useApp();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(file.lastModified),
      category: getFileCategory(file.type),
      tags: [],
      starred: false,
      path: '/',
    }));

    dispatch({ type: 'ADD_FILES', payload: newFiles });
    toast.success(`${acceptedFiles.length} file(s) uploaded successfully!`);
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.flac', '.aac', '.ogg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/*': ['.txt', '.md', '.csv'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'application/x-7z-compressed': ['.7z'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const getFileCategory = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'Images';
    if (mimeType.startsWith('video/')) return 'Videos';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'Documents';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return 'Archives';
    return 'Other';
  };

  const getFileIcon = (category: string) => {
    switch (category) {
      case 'Images':
        return <Image className="w-8 h-8 text-blue-500" />;
      case 'Videos':
        return <Video className="w-8 h-8 text-purple-500" />;
      case 'Audio':
        return <Music className="w-8 h-8 text-green-500" />;
      case 'Archives':
        return <Archive className="w-8 h-8 text-orange-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-slideInUp">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center">
          <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse"></span>
          Upload Your Files
        </h3>
        <p className="text-gray-600 text-lg">
          Drag and drop your files here or click to browse. Our AI will automatically organize them for you.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`group border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 hover:scale-102 ${
          isDragActive
            ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 scale-105 shadow-lg'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-primary-50 hover:shadow-md'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-6">
          <div className={`transition-all duration-300 ${isDragActive ? 'scale-110 animate-bounce' : 'group-hover:scale-110'}`}>
            <Upload className={`w-16 h-16 transition-colors duration-300 ${
              isDragActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
            }`} />
          </div>
          
          {isDragActive ? (
            <div className="animate-fadeIn">
              <p className="text-xl font-semibold text-primary-600 mb-2">Drop files here</p>
              <p className="text-sm text-gray-500">Release to upload</p>
            </div>
          ) : (
            <div>
              <p className="text-xl font-semibold text-gray-700 mb-2">Drag files here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
                Browse Files
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full inline-block">
          Supports all file types up to 100MB
        </p>
      </div>

      {/* Supported file types */}
      <div className="mt-6 sm:mt-8 grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
        {['Images', 'Videos', 'Audio', 'Documents', 'Archives'].map((category, index) => (
          <div 
            key={category} 
            className="group flex flex-col items-center p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-primary-50 hover:to-primary-100 transition-all duration-300 hover:scale-105 hover:shadow-md animate-slideInUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="group-hover:scale-110 transition-transform duration-300">
              {getFileIcon(category)}
            </div>
            <span className="text-xs sm:text-sm text-gray-600 mt-2 font-medium group-hover:text-primary-600 transition-colors duration-300 text-center">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
