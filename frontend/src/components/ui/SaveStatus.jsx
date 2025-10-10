import React from 'react';

const SaveStatus = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'saving':
        return 'text-yellow-500';
      case 'saved':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Auto-saved';
      case 'error':
        return 'Save failed';
      default:
        return '';
    }
  };

  return (
    <div className={`flex items-center gap-2 text-sm font-medium ${getStatusColor()}`}>
      <div className="w-2 h-2 rounded-full bg-current" />
      <span>{getStatusText()}</span>
    </div>
  );
};

export default SaveStatus;