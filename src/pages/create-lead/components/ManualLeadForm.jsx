import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ManualLeadForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return !phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')) ? 'Please enter a valid phone number' : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true });

    if (Object.keys(newErrors).length === 0) {
      onSubmit({ ...formData, source: 'Manual' });
    }
  };

  const isFormValid = Object.keys(formData).every(key => 
    formData[key].trim() !== '' && !validateField(key, formData[key])
  );

  return (
    <div className="bg-background border border-border rounded-card p-6 h-fit">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-button flex items-center justify-center">
          <Icon name="UserPlus" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-lg font-heading-semibold text-text-primary">Manual Lead Entry</h2>
          <p className="text-sm text-text-secondary">Enter lead information manually</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-body-medium text-text-primary mb-2">
            Full Name *
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={errors.name ? 'border-error' : ''}
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-body-medium text-text-primary mb-2">
            Email Address *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={errors.email ? 'border-error' : ''}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-body-medium text-text-primary mb-2">
            Phone Number *
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={errors.phone ? 'border-error' : ''}
            required
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-error flex items-center space-x-1">
              <Icon name="AlertCircle" size={14} />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        <div className="pt-4">
          <Button
            variant="primary"
            type="submit"
            disabled={!isFormValid || isLoading}
            loading={isLoading}
            fullWidth
            iconName="UserPlus"
            iconPosition="left"
          >
            {isLoading ? 'Creating Lead...' : 'Create Lead'}
          </Button>
        </div>
      </form>

      <div className="mt-4 p-3 bg-surface rounded-button border border-border-light">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} color="var(--color-primary)" className="mt-0.5" />
          <div className="text-xs text-text-secondary">
            <p className="font-body-medium">Required Information</p>
            <p>All fields marked with * are required to create a lead</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualLeadForm;