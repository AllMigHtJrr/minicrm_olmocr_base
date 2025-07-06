import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DocumentUpload = ({ onUpload, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const supportedFormats = [
    { type: 'PDF', extension: '.pdf', icon: 'FileText', color: 'text-red-600' },
    { type: 'PNG', extension: '.png', icon: 'Image', color: 'text-blue-600' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    const allowedTypes = ['application/pdf', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only PDF or PNG files');
      return;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    simulateUpload(file);
  };

  const [uploadComplete, setUploadComplete] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  const simulateUpload = (file) => {
    setUploadProgress(0);
    setFileToUpload(file);
    setUploadComplete(false);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Handle upload completion with useEffect
  useEffect(() => {
    if (uploadComplete && fileToUpload) {
      onUpload(fileToUpload);
      setUploadComplete(false);
      setFileToUpload(null);
    }
  }, [uploadComplete, fileToUpload, onUpload]);

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileName) => {
    if (fileName.toLowerCase().endsWith('.pdf')) return 'FileText';
    if (fileName.toLowerCase().endsWith('.png')) return 'Image';
    return 'File';
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-background border border-border rounded-card p-6 h-fit">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-button flex items-center justify-center">
          <Icon name="Upload" size={20} color="var(--color-accent)" />
        </div>
        <div>
          <h2 className="text-lg font-heading-semibold text-text-primary">Document Upload</h2>
          <p className="text-sm text-text-secondary">Upload documents for automated lead extraction</p>
        </div>
      </div>

      {!uploadedFile ? (
        <div
          className={`
            border-2 border-dashed rounded-card p-8 text-center transition-smooth cursor-pointer
            ${dragActive 
              ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-surface'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png"
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center">
              <Icon name="CloudUpload" size={32} color="var(--color-text-secondary)" />
            </div>
            
            <div>
              <p className="text-lg font-body-medium text-text-primary mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-text-secondary">
                Maximum file size: 10MB
              </p>
            </div>

            <Button
              variant="outline"
              iconName="FolderOpen"
              iconPosition="left"
              onClick={handleBrowseClick}
            >
              Browse Files
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-surface border border-border-light rounded-button p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-button flex items-center justify-center">
                  <Icon name={getFileIcon(uploadedFile.name)} size={20} color="var(--color-primary)" />
                </div>
                <div>
                  <p className="text-sm font-body-medium text-text-primary">{uploadedFile.name}</p>
                  <p className="text-xs text-text-secondary">{getFileSize(uploadedFile.size)}</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                iconName="X"
                onClick={handleRemoveFile}
                disabled={isProcessing}
              />
            </div>

            {uploadProgress < 100 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-smooth"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {isProcessing && uploadProgress === 100 && (
              <div className="mt-3 flex items-center space-x-2 text-sm text-accent">
                <Icon name="Loader2" size={16} className="animate-spin" />
                <span>Processing document...</span>
              </div>
            )}
          </div>

          <Button
            variant="secondary"
            fullWidth
            iconName="Upload"
            iconPosition="left"
            onClick={handleBrowseClick}
            disabled={isProcessing}
          >
            Upload Another Document
          </Button>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-body-medium text-text-primary">Supported Formats</h3>
        <div className="grid grid-cols-2 gap-3">
          {supportedFormats.map((format) => (
            <div key={format.type} className="flex items-center space-x-2 p-2 bg-surface rounded-button">
              <Icon name={format.icon} size={16} className={format.color} />
              <div className="text-xs">
                <p className="font-body-medium text-text-primary">{format.type}</p>
                <p className="text-text-secondary">{format.extension}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-warning/5 border border-warning/20 rounded-button">
        <div className="flex items-start space-x-2">
          <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="mt-0.5" />
          <div className="text-xs text-text-secondary">
            <p className="font-body-medium text-warning">Processing Note</p>
            <p>Documents will be processed using OCR technology to extract lead information automatically.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;