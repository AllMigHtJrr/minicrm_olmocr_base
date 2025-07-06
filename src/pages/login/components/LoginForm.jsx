import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for different user types
  const mockCredentials = {
    admin: { email: 'admin@minicrm.com', password: 'admin123', role: 'admin', dashboard: '/admin-dashboard' },
    sales: { email: 'sales@minicrm.com', password: 'sales123', role: 'sales', dashboard: '/sales-dashboard' },
    manager: { email: 'manager@minicrm.com', password: 'manager123', role: 'manager', dashboard: '/manager-dashboard' }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const userCredentials = Object.values(mockCredentials).find(
        cred => cred.email === formData.email && cred.password === formData.password
      );
      
      if (userCredentials) {
        // Store user session with role information
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', formData.email);
        localStorage.setItem('userRole', userCredentials.role);
        
        // Navigate to role-specific dashboard
        navigate(userCredentials.dashboard);
      } else {
        setErrors({
          general: 'Invalid email or password. Please try again.'
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-body-medium text-text-primary mb-2">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full ${errors.email ? 'border-error' : ''}`}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={16} className="mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-body-medium text-text-primary mb-2">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full ${errors.password ? 'border-error' : ''}`}
            required
          />
          {errors.password && (
            <p className="mt-1 text-sm text-error flex items-center">
              <Icon name="AlertCircle" size={16} className="mr-1" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <Input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label htmlFor="rememberMe" className="text-sm text-text-secondary">
            Remember me for 30 days
          </label>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-card">
            <p className="text-sm text-error flex items-center">
              <Icon name="XCircle" size={16} className="mr-2" />
              {errors.general}
            </p>
          </div>
        )}

        {/* Submit Button - This is the functional login button */}
        <Button
          variant="primary"
          type="submit"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          className="h-12 font-semibold"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Icon name="Loader2" size={20} className="animate-spin mr-2" />
              Signing In...
            </div>
          ) : (
            'Sign In'
          )}
        </Button>

        {/* Helper Links */}
        <div className="text-center space-y-2">
          <button
            type="button"
            className="text-sm text-primary hover:text-primary/80 transition-micro"
            onClick={() => {
              // Mock forgot password functionality
              alert('Password reset link would be sent to your email');
            }}
          >
            Forgot your password?
          </button>
          
          <div className="text-sm text-text-secondary">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-primary hover:text-primary/80 transition-micro"
              onClick={() => {
                // Mock registration functionality
                alert('Registration feature coming soon');
              }}
            >
              Sign up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;