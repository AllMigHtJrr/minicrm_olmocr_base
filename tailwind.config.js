/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2563EB', // blue-600
        'primary-foreground': '#FFFFFF', // white
        
        // Secondary Colors
        'secondary': '#64748B', // slate-500
        'secondary-foreground': '#FFFFFF', // white
        
        // Accent Colors
        'accent': '#0EA5E9', // sky-500
        'accent-foreground': '#FFFFFF', // white
        
        // Background Colors
        'background': '#FFFFFF', // white
        'surface': '#F8FAFC', // slate-50
        
        // Text Colors
        'text-primary': '#0F172A', // slate-900
        'text-secondary': '#475569', // slate-600
        
        // Status Colors
        'success': '#059669', // emerald-600
        'success-foreground': '#FFFFFF', // white
        'warning': '#D97706', // amber-600
        'warning-foreground': '#FFFFFF', // white
        'error': '#DC2626', // red-600
        'error-foreground': '#FFFFFF', // white
        
        // Border Colors
        'border': '#E2E8F0', // slate-200
        'border-light': '#F1F5F9', // slate-100
      },
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'caption': ['Inter', 'system-ui', 'sans-serif'],
        'data': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontWeight: {
        'heading-regular': '400',
        'heading-medium': '500',
        'heading-semibold': '600',
        'body-regular': '400',
        'body-medium': '500',
        'caption-regular': '400',
        'data-regular': '400',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'floating': '0 10px 25px rgba(0, 0, 0, 0.15)',
        'medium': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'card': '6px',
        'button': '4px',
        'input': '4px',
      },
      transitionDuration: {
        'micro': '200ms',
        'smooth': '300ms',
      },
      transitionTimingFunction: {
        'micro': 'ease-out',
        'smooth': 'ease-in-out',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      zIndex: {
        'header': '100',
        'navigation': '90',
        'modal': '1000',
        'toast': '1100',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}