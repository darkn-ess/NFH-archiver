import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface TabButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 w-full sm:w-auto justify-center
        ${isActive 
          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        }
      `}
    >
      <Icon className="w-5 h-5 mr-2" />
      <span className="font-medium">{label}</span>
    </button>
  );
};