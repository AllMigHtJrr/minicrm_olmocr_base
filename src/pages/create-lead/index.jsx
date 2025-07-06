import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import { Toast } from '../../components/ui/Toast';
import BreadcrumbNavigation from './components/BreadcrumbNavigation';
import ManualLeadForm from './components/ManualLeadForm';
import DocumentUpload from './components/DocumentUpload';
import SuccessModal from './components/SuccessModal';
import ExtractedLeadPreview from './components/ExtractedLeadPreview';
import apiService from '../../services/api';

const CreateLead = () => {
  const navigate = useNavigate();
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [isDocumentProcessing, setIsDocumentProcessing] = useState(false);
  const [isConfirmingExtracted, setIsConfirmingExtracted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdLead, setCreatedLead] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const handleManualSubmit = async (formData) => {
    setIsManualLoading(true);
    try {
      const response = await apiService.createLeadManual(formData);
      setCreatedLead(response);
        setShowSuccessModal(true);
        showToast('Lead created successfully!', 'success');
    } catch (error) {
      console.error('Failed to create lead:', error);
      showToast(error.message || 'Failed to create lead. Please try again.', 'error');
    } finally {
      setIsManualLoading(false);
    }
  };

  const handleDocumentUpload = async (file) => {
    setIsDocumentProcessing(true);
    try {
      const response = await apiService.createLeadFromDocument(file);
      
      setExtractedData({
        name: response.name,
        email: response.email,
        phone: response.phone,
        source: response.source,
        confidence: response.confidence,
        extraction_notes: response.extraction_notes
      });
      
      showToast('Document processed successfully!', 'success');
    } catch (error) {
      console.error('Failed to process document:', error);
      showToast(error.message || 'Failed to process document. Please try again.', 'error');
    } finally {
      setIsDocumentProcessing(false);
    }
  };

  const handleConfirmExtracted = async () => {
    setIsConfirmingExtracted(true);
    try {
      const response = await apiService.createLeadManual(extractedData);
      setCreatedLead(response);
        setShowSuccessModal(true);
        setExtractedData(null);
        showToast('Lead created from document successfully!', 'success');
    } catch (error) {
      console.error('Failed to create lead from document:', error);
      showToast(error.message || 'Failed to create lead. Please try again.', 'error');
    } finally {
      setIsConfirmingExtracted(false);
    }
  };

  const handleEditExtracted = () => {
    // In a real app, this would open an edit form
    showToast('Edit functionality would open here', 'info');
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    setCreatedLead(null);
    setExtractedData(null);
    // Reset forms would go here
  };

  const handleViewDashboard = () => {
    navigate('/lead-dashboard');
  };

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation />
          
          <div className="mb-8">
            <h1 className="text-2xl font-heading-semibold text-text-primary mb-2">
              Create New Lead
            </h1>
            <p className="text-text-secondary">
              Add new leads to your CRM by entering information manually or uploading documents for automatic extraction.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Manual Lead Form */}
            <div className="space-y-6">
              <ManualLeadForm 
                onSubmit={handleManualSubmit}
                isLoading={isManualLoading}
              />
            </div>

            {/* Document Upload */}
            <div className="space-y-6">
              <DocumentUpload 
                onUpload={handleDocumentUpload}
                isProcessing={isDocumentProcessing}
              />
              
              {/* Extracted Lead Preview */}
              <ExtractedLeadPreview
                extractedData={extractedData}
                onConfirm={handleConfirmExtracted}
                onEdit={handleEditExtracted}
                isConfirming={isConfirmingExtracted}
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mt-12 bg-background border border-border rounded-card p-6">
            <h2 className="text-lg font-heading-semibold text-text-primary mb-4">
              Lead Creation Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-body-medium text-text-primary">Manual Entry</h3>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Ensure all contact information is accurate</li>
                  <li>• Double-check email addresses for typos</li>
                  <li>• Include country code for international numbers</li>
                  <li>• Use full names for better lead identification</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-body-medium text-text-primary">Document Upload</h3>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Supported formats: PDF and PNG files</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Ensure text is clear and readable</li>
                  <li>• Review extracted data before confirming</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        leadData={createdLead}
        onCreateAnother={handleCreateAnother}
        onViewDashboard={handleViewDashboard}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CreateLead;