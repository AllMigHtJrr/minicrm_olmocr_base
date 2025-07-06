import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const BreadcrumbNavigation = () => {
  const location = useLocation();

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/lead-dashboard', icon: 'Home' },
    { label: 'Create Lead', path: '/create-lead', icon: 'UserPlus' }
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={16} color="var(--color-text-secondary)" />
          )}
          
          {index === breadcrumbItems.length - 1 ? (
            <div className="flex items-center space-x-2 text-text-primary">
              <Icon name={item.icon} size={16} />
              <span className="font-body-medium">{item.label}</span>
            </div>
          ) : (
            <Link
              to={item.path}
              className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-micro"
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNavigation;