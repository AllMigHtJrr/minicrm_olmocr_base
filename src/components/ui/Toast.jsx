import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 4000, 
  onClose,
  persistent = false 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, persistent]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 200);
  };

  const getToastStyles = () => {
    const baseStyles = "flex items-center p-4 rounded-card shadow-floating border transition-smooth";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-success text-success-foreground border-success`;
      case 'warning':
        return `${baseStyles} bg-warning text-warning-foreground border-warning`;
      case 'error':
        return `${baseStyles} bg-error text-error-foreground border-error`;
      default:
        return `${baseStyles} bg-background text-text-primary border-border`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Info';
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed top-4 right-4 max-w-sm w-full z-toast
        transform transition-smooth
        ${isExiting 
          ? 'translate-x-full opacity-0' :'translate-x-0 opacity-100'
        }
      `}
    >
      <div className={getToastStyles()}>
        <div className="flex-shrink-0 mr-3">
          <Icon 
            name={getIcon()} 
            size={20} 
            color={type === 'info' ? 'var(--color-primary)' : 'currentColor'} 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-body-medium">{message}</p>
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-3 p-1 rounded-button hover:bg-black/10 transition-micro"
        >
          <Icon name="X" size={16} />
        </button>
      </div>
    </div>
  );
};

const ToastContainer = ({ toasts = [] }) => {
  return (
    <div className="fixed top-4 right-4 z-toast space-y-2">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id || index}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          persistent={toast.persistent}
          onClose={toast.onClose}
        />
      ))}
    </div>
  );
};

export { Toast, ToastContainer };
export default Toast;