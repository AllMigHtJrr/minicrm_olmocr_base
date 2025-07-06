import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ExtractedLeadPreview = ({ extractedData, onConfirm, onEdit, isConfirming }) => {
  if (!extractedData) return null;

  const confidencePercentage = extractedData.confidence 
    ? Math.round(extractedData.confidence * 100) 
    : null;

  return (
    <div className="bg-success/5 border border-success/20 rounded-card p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
        <Icon name="Sparkles" size={20} color="var(--color-success)" />
        <h3 className="text-sm font-body-medium text-success">Lead Information Extracted</h3>
        </div>
        {confidencePercentage && (
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={14} color="var(--color-success)" />
            <span className="text-xs font-medium text-success">{confidencePercentage}% confidence</span>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-background rounded-button p-3 border border-border-light">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="User" size={14} color="var(--color-text-secondary)" />
              <span className="text-xs font-body-medium text-text-secondary">Name</span>
            </div>
            <p className="text-sm text-text-primary">{extractedData.name || 'Not found'}</p>
          </div>

          <div className="bg-background rounded-button p-3 border border-border-light">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Mail" size={14} color="var(--color-text-secondary)" />
              <span className="text-xs font-body-medium text-text-secondary">Email</span>
            </div>
            <p className="text-sm text-text-primary">{extractedData.email || 'Not found'}</p>
          </div>

          <div className="bg-background rounded-button p-3 border border-border-light sm:col-span-2">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Phone" size={14} color="var(--color-text-secondary)" />
              <span className="text-xs font-body-medium text-text-secondary">Phone</span>
            </div>
            <p className="text-sm text-text-primary">{extractedData.phone || 'Not found'}</p>
          </div>
        </div>

        {/* Extraction Notes */}
        {extractedData.extraction_notes && (
          <div className="bg-background rounded-button p-3 border border-border-light">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="FileText" size={14} color="var(--color-text-secondary)" />
              <span className="text-xs font-body-medium text-text-secondary">Extraction Notes</span>
            </div>
            <p className="text-sm text-text-primary">{extractedData.extraction_notes}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          onClick={onEdit}
          iconName="Edit"
          iconPosition="left"
          fullWidth
        >
          Edit Information
        </Button>
        
        <Button
          variant="success"
          onClick={onConfirm}
          loading={isConfirming}
          iconName="Check"
          iconPosition="left"
          fullWidth
        >
          {isConfirming ? 'Creating Lead...' : 'Confirm & Create Lead'}
        </Button>
      </div>

      <div className="mt-3 p-2 bg-background/50 rounded-button">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={14} color="var(--color-primary)" className="mt-0.5" />
          <p className="text-xs text-text-secondary">
            Review the extracted information above. You can edit any details before creating the lead.
            {confidencePercentage && ` Confidence score: ${confidencePercentage}%`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExtractedLeadPreview;