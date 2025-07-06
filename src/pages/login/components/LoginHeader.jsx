import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  const Logo = () => (
    <div className="flex items-center justify-center space-x-3 mb-8">
      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-card">
        <Icon name="Users" size={28} color="white" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-heading-semibold text-text-primary">
          Mini CRM
        </h1>
        <p className="text-sm text-text-secondary">
          Lead Management System
        </p>
      </div>
    </div>
  );

  return (
    <div className="text-center mb-8">
      <Logo />
      
      <div className="space-y-2">
        <h2 className="text-xl font-heading-semibold text-text-primary">
          Welcome Back
        </h2>
        <p className="text-text-secondary">
          Sign in to access your CRM dashboard
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;