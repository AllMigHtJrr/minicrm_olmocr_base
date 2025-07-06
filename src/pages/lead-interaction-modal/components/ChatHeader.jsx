import React from 'react';
import Icon from '../../../components/AppIcon';

const ChatHeader = ({ lead, onClose }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-green-100 text-green-800';
      case 'qualified':
        return 'bg-purple-100 text-purple-800';
      case 'converted':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-6 border-b border-border bg-surface">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="User" size={24} color="var(--color-primary)" />
        </div>
        
        <div className="flex-1">
          <h2 className="text-lg font-heading-semibold text-text-primary">
            {lead?.name || 'Unknown Lead'}
          </h2>
          
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center space-x-1 text-sm text-text-secondary">
              <Icon name="Mail" size={14} />
              <span>{lead?.email || 'No email'}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-text-secondary">
              <Icon name="Phone" size={14} />
              <span>{lead?.phone || 'No phone'}</span>
            </div>
            
            <span className={`px-2 py-1 rounded-full text-xs font-body-medium ${getStatusColor(lead?.status)}`}>
              {lead?.status || 'Unknown'}
            </span>
          </div>
        </div>
      </div>
      
      <button
        onClick={onClose}
        className="p-2 rounded-button hover:bg-background transition-micro"
        aria-label="Close chat"
      >
        <Icon name="X" size={20} />
      </button>
    </div>
  );
};

export default ChatHeader;