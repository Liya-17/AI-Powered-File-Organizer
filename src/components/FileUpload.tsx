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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Files</h3>
        <p className="text-gray-600">
          Drag and drop your files here or click to browse. Our AI will automatically organize them for you.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <Upload className="w-12 h-12 text-gray-400" />
          
          {isDragActive ? (
            <div>
              <p className="text-lg font-medium text-primary-600">Drop files here</p>
              <p className="text-sm text-gray-500">Release to upload</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-700">Drag files here</p>
              <p className="text-sm text-gray-500">or</p>
              <button className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Browse Files
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">Supports all file types up to 100MB</p>
      </div>

      {/* Supported file types */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {['Images', 'Videos', 'Audio', 'Documents', 'Archives'].map((category) => (
          <div key={category} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
            {getFileIcon(category)}
            <span className="text-xs text-gray-600 mt-1">{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
