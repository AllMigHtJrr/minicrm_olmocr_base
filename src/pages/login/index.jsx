import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import CredentialsHelper from './components/CredentialsHelper';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/lead-dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-background to-surface flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Main Login Container */}
      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-background rounded-card shadow-floating border border-border p-8">
          <LoginHeader />
          <LoginForm />
        </div>

        {/* Demo Credentials Helper */}
        <CredentialsHelper />

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} Mini CRM. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-2">
            <button className="text-xs text-text-secondary hover:text-primary transition-micro">
              Privacy Policy
            </button>
            <span className="text-xs text-border">•</span>
            <button className="text-xs text-text-secondary hover:text-primary transition-micro">
              Terms of Service
            </button>
            <span className="text-xs text-border">•</span>
            <button className="text-xs text-text-secondary hover:text-primary transition-micro">
              Support
            </button>
          </div>
        </div>
      </div>

      {/* Side Decoration - Hidden on mobile */}
      <div className="hidden lg:block absolute top-8 right-8 opacity-10">
        <div className="w-32 h-32 border-2 border-primary rounded-full" />
        <div className="w-24 h-24 border-2 border-accent rounded-full mt-4 ml-8" />
      </div>

      <div className="hidden lg:block absolute bottom-8 left-8 opacity-10">
        <div className="w-20 h-20 border-2 border-secondary rounded-full" />
        <div className="w-16 h-16 border-2 border-primary rounded-full mt-2 ml-4" />
      </div>
    </div>
  );
};

export default Login;