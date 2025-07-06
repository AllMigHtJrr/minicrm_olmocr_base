import React from 'react';

import Button from '../../../components/ui/Button';

const WorkflowToolbar = ({ 
  onSave, 
  onZoomIn, 
  onZoomOut, 
  onFitView, 
  onClear,
  isSaving,
  hasUnsavedChanges 
}) => {
  return (
    <div className="bg-background border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-heading-semibold text-text-primary">
            Workflow Builder
          </h1>
          {hasUnsavedChanges && (
            <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-button">
              Unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-surface rounded-button p-1">
            <Button
              variant="ghost"
              onClick={onZoomOut}
              iconName="ZoomOut"
              className="p-2"
              title="Zoom Out"
            />
            <Button
              variant="ghost"
              onClick={onFitView}
              iconName="Maximize2"
              className="p-2"
              title="Fit to View"
            />
            <Button
              variant="ghost"
              onClick={onZoomIn}
              iconName="ZoomIn"
              className="p-2"
              title="Zoom In"
            />
          </div>

          {/* Action Buttons */}
          <Button
            variant="secondary"
            onClick={onClear}
            iconName="Trash2"
            className="px-4"
          >
            Clear
          </Button>

          <Button
            variant="primary"
            onClick={onSave}
            loading={isSaving}
            iconName="Save"
            className="px-6"
          >
            Save Workflow
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowToolbar;