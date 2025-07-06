import React from 'react';
import Icon from '../../../components/AppIcon';

const NodePalette = ({ onDragStart }) => {
  const actionNodes = [
    {
      id: 'send-email',
      type: 'sendEmail',
      label: 'Send Email',
      icon: 'Mail',
      color: 'bg-blue-500',
      description: 'Send automated email to lead'
    },
    {
      id: 'update-status',
      type: 'updateStatus',
      label: 'Update Status',
      icon: 'RefreshCw',
      color: 'bg-green-500',
      description: 'Change lead status'
    }
  ];

  const handleDragStart = (event, nodeType, nodeData) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: nodeType,
      ...nodeData
    }));
    event.dataTransfer.effectAllowed = 'move';
    onDragStart?.(nodeType, nodeData);
  };

  return (
    <div className="w-64 bg-surface border-r border-border h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-heading-semibold text-text-primary">
          Action Nodes
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          Drag nodes to canvas to build workflow
        </p>
      </div>

      <div className="p-4 space-y-3">
        {actionNodes.map((node) => (
          <div
            key={node.id}
            draggable
            onDragStart={(e) => handleDragStart(e, node.type, node)}
            className="group cursor-grab active:cursor-grabbing bg-background border border-border rounded-card p-3 hover:shadow-card transition-smooth hover:border-primary/30"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${node.color} rounded-md flex items-center justify-center flex-shrink-0`}>
                <Icon name={node.icon} size={16} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-body-medium text-text-primary group-hover:text-primary transition-micro">
                  {node.label}
                </h4>
                <p className="text-xs text-text-secondary mt-1">
                  {node.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border mt-4">
        <div className="bg-background border border-border rounded-card p-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center flex-shrink-0">
              <Icon name="Play" size={16} color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-body-medium text-text-primary">
                Lead Created
              </h4>
              <p className="text-xs text-text-secondary mt-1">
                Workflow trigger (always present)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodePalette;