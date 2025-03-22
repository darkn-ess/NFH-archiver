import React from 'react';

interface ProgressBarProps {
  progress: number;
  status: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{status}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
          style={{ 
            width: `${progress}%`,
            transition: 'width 0.3s ease-out'
          }}
        />
      </div>
    </div>
  );
};