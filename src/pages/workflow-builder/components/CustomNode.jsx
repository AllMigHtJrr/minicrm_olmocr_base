import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import Icon from '../../../components/AppIcon';

const CustomNode = memo(({ data, selected }) => {
  const getNodeConfig = () => {
    switch (data.type) {
      case 'trigger':
        return {
          icon: 'Play',
          color: 'bg-primary',
          borderColor: 'border-primary',
          title: 'Lead Created',
          subtitle: 'Workflow starts here'
        };
      case 'sendEmail':
        return {
          icon: 'Mail',
          color: 'bg-blue-500',
          borderColor: 'border-blue-500',
          title: 'Send Email',
          subtitle: data.emailTemplate || 'Configure email template'
        };
      case 'updateStatus':
        return {
          icon: 'RefreshCw',
          color: 'bg-green-500',
          borderColor: 'border-green-500',
          title: 'Update Status',
          subtitle: data.status || 'Configure status'
        };
      default:
        return {
          icon: 'Circle',
          color: 'bg-secondary',
          borderColor: 'border-secondary',
          title: 'Unknown',
          subtitle: 'Unknown node type'
        };
    }
  };

  const config = getNodeConfig();

  return (
    <div 
      className={`
        bg-background border-2 rounded-card shadow-card min-w-[200px] transition-smooth
        ${selected ? `${config.borderColor} shadow-floating` : 'border-border hover:border-primary/30'}
      `}
    >
      {/* Input Handle */}
      {data.type !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-primary border-2 border-background"
        />
      )}

      {/* Node Content */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${config.color} rounded-md flex items-center justify-center flex-shrink-0`}>
            <Icon name={config.icon} size={20} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-body-semibold text-text-primary">
              {config.title}
            </h4>
            <p className="text-xs text-text-secondary mt-1 truncate">
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* Configuration Status */}
        {data.type !== 'trigger' && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                {data.configured ? 'Configured' : 'Needs configuration'}
              </span>
              <div className={`w-2 h-2 rounded-full ${data.configured ? 'bg-success' : 'bg-warning'}`} />
            </div>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;