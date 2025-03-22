import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FolderUp } from 'lucide-react';

interface FileDropzoneProps {
  onFilesDrop: (files: File[]) => void;
  accept?: Record<string, string[]>;
  description?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({ onFilesDrop, accept, description }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesDrop(acceptedFiles);
  }, [onFilesDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept,
    noClick: false,
    noKeyboard: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        w-full p-4 sm:p-8 border-2 border-dashed rounded-lg transition-all duration-300
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-102' 
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-center">
        <FolderUp className={`w-12 h-12 mb-4 transition-colors duration-300 ${
          isDragActive ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
        }`} />
        <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300">
          {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {description || 'or click to select files'}
        </p>
      </div>
    </div>
  );
};