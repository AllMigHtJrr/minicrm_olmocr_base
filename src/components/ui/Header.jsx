import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/lead-dashboard',
      icon: 'LayoutDashboard'
    },
    {
      label: 'Create Lead',
      path: '/create-lead',
      icon: 'UserPlus'
    },
    {
      label: 'Workflows',
      path: '/workflow-builder',
      icon: 'GitBranch'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const Logo = () => (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
        <Icon name="Users" size={20} color="white" />
      </div>
      <span className="text-xl font-heading-semibold text-text-primary">
        Mini CRM
      </span>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-header">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/lead-dashboard" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 ml-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-button text-sm font-body-medium
                  transition-micro hover:bg-surface
                  ${isActiveRoute(item.path) 
                    ? 'text-primary bg-primary/5 border-b-2 border-primary' :'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
            {/* Logout Button (Desktop) */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-button text-sm font-body-medium text-error hover:bg-error/10 transition-micro ml-2"
              >
                <Icon name="LogOut" size={16} />
                <span>Logout</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-button hover:bg-surface transition-micro">
            <Icon name="Menu" size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Hidden by default, would be toggled via state */}
      <div className="md:hidden border-t border-border bg-surface">
        <nav className="px-4 py-2 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-3 py-2 rounded-button text-sm font-body-medium
                transition-micro
                ${isActiveRoute(item.path) 
                  ? 'text-primary bg-primary/10' :'text-text-secondary hover:text-text-primary hover:bg-background'
                }
              `}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
          {/* Logout Button (Mobile) */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 rounded-button text-sm font-body-medium text-error hover:bg-error/10 transition-micro w-full mt-2"
            >
              <Icon name="LogOut" size={18} />
              <span>Logout</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;