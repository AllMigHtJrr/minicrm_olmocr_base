import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CredentialsHelper = () => {
  const [isVisible, setIsVisible] = useState(false);

  const mockCredentials = [
    {
      role: 'Administrator',
      email: 'admin@minicrm.com',
      password: 'admin123',
      description: 'Full system access with workflow management'
    },
    {
      role: 'Sales Representative',
      email: 'sales@minicrm.com',
      password: 'sales123',
      description: 'Lead creation and interaction capabilities'
    },
    {
      role: 'Sales Manager',
      email: 'manager@minicrm.com',
      password: 'manager123',
      description: 'Team oversight and reporting access'
    }
  ];

  return (
    <div className="mt-8 p-4 bg-surface rounded-card border border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-body-medium text-text-primary flex items-center">
          <Icon name="Key" size={16} className="mr-2" />
          Demo Credentials
        </h3>
        <Button
          variant="ghost"
          onClick={() => setIsVisible(!isVisible)}
          iconName={isVisible ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          className="text-xs"
        >
          {isVisible ? 'Hide' : 'Show'}
        </Button>
      </div>
      
      {isVisible && (
        <div className="space-y-3">
          {mockCredentials.map((cred, index) => (
            <div key={index} className="p-3 bg-background rounded-button border border-border-light">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-body-medium text-text-primary">
                  {cred.role}
                </span>
                <Icon name="User" size={14} className="text-text-secondary" />
              </div>
              
              <div className="space-y-1 text-xs">
                <div className="flex items-center">
                  <span className="text-text-secondary w-16">Email:</span>
                  <code className="text-primary bg-primary/10 px-2 py-1 rounded">
                    {cred.email}
                  </code>
                </div>
                <div className="flex items-center">
                  <span className="text-text-secondary w-16">Password:</span>
                  <code className="text-primary bg-primary/10 px-2 py-1 rounded">
                    {cred.password}
                  </code>
                </div>
              </div>
              
              <p className="text-xs text-text-secondary mt-2 italic">
                {cred.description}
              </p>
            </div>
          ))}
          
          <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded-button">
            <p className="text-xs text-warning flex items-center">
              <Icon name="AlertTriangle" size={12} className="mr-1" />
              These are demo credentials for testing purposes only
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialsHelper;