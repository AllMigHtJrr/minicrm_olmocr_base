import React from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SuccessModal = ({ isOpen, onClose, leadData, onCreateAnother, onViewDashboard }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      closeOnBackdrop={false}
      closeOnEscape={false}
      showCloseButton={false}
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} color="var(--color-success)" />
        </div>
        
        <h2 className="text-xl font-heading-semibold text-text-primary mb-2">
          Lead Created Successfully!
        </h2>
        
        <p className="text-text-secondary mb-6">
          The lead has been added to your CRM dashboard and is ready for follow-up.
        </p>

        {leadData && (
          <div className="bg-surface border border-border-light rounded-card p-4 mb-6 text-left">
            <h3 className="text-sm font-body-medium text-text-primary mb-3">Lead Details</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name="User" size={16} color="var(--color-text-secondary)" />
                <span className="text-sm text-text-primary">{leadData.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} color="var(--color-text-secondary)" />
                <span className="text-sm text-text-primary">{leadData.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={16} color="var(--color-text-secondary)" />
                <span className="text-sm text-text-primary">{leadData.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Tag" size={16} color="var(--color-text-secondary)" />
                <span className="text-sm text-text-primary">Source: {leadData.source}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onCreateAnother}
            iconName="Plus"
            iconPosition="left"
            fullWidth
          >
            Create Another Lead
          </Button>
          
          <Button
            variant="primary"
            onClick={onViewDashboard}
            iconName="LayoutDashboard"
            iconPosition="left"
            fullWidth
          >
            View Dashboard
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;