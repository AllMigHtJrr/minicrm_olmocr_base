import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const NodeConfigPanel = ({ selectedNode, onUpdateNode, onClose }) => {
  const [config, setConfig] = useState({});

  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.data || {});
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        ...selectedNode.data,
        ...config,
        configured: true
      });
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!selectedNode || selectedNode.data?.type === 'trigger') {
    return null;
  }

  const renderConfigFields = () => {
    switch (selectedNode.data?.type) {
      case 'sendEmail':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-body-medium text-text-primary mb-2">
                Email Subject
              </label>
              <Input
                type="text"
                placeholder="Enter email subject"
                value={config.emailSubject || ''}
                onChange={(e) => handleInputChange('emailSubject', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-body-medium text-text-primary mb-2">
                Email Template
              </label>
              <textarea
                className="w-full p-3 border border-border rounded-button text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-micro"
                rows={6}
                placeholder="Enter email template content..."
                value={config.emailTemplate || ''}
                onChange={(e) => handleInputChange('emailTemplate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-body-medium text-text-primary mb-2">
                Sender Name
              </label>
              <Input
                type="text"
                placeholder="Enter sender name"
                value={config.senderName || ''}
                onChange={(e) => handleInputChange('senderName', e.target.value)}
              />
            </div>
          </div>
        );

      case 'updateStatus':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-body-medium text-text-primary mb-2">
                New Status
              </label>
              <select
                className="w-full p-3 border border-border rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-micro"
                value={config.status || ''}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="">Select status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-body-medium text-text-primary mb-2">
                Update Reason
              </label>
              <textarea
                className="w-full p-3 border border-border rounded-button text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-micro"
                rows={3}
                placeholder="Enter reason for status update..."
                value={config.updateReason || ''}
                onChange={(e) => handleInputChange('updateReason', e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <Icon name="Settings" size={48} className="mx-auto text-text-secondary mb-4" />
            <p className="text-text-secondary">No configuration available for this node type</p>
          </div>
        );
    }
  };

  return (
    <div className="w-80 bg-background border-l border-border h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading-semibold text-text-primary">
            Configure Node
          </h3>
          <Button
            variant="ghost"
            onClick={onClose}
            iconName="X"
            className="p-2"
          />
        </div>
        <p className="text-sm text-text-secondary mt-1">
          {selectedNode.data?.label || 'Unknown Node'}
        </p>
      </div>

      <div className="p-4">
        {renderConfigFields()}

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={handleSave}
              className="flex-1"
              iconName="Save"
            >
              Save Configuration
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeConfigPanel;