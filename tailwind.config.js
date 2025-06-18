/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3366FF',          // instead of css var
        'primary-light': '#6699FF',
        'primary-dark': '#0033CC',
        secondary: '#FF6633',
        'secondary-light': '#FF9966',
        'secondary-dark': '#CC3300',
        success: '#27AE60',
        warning: '#F1C40F',
        error: '#E74C3C',
        'gray-50': '#FAFAFC',
        'gray-100': '#F1F2F6',
        'gray-200': '#E5E7EB',
        'gray-300': '#D1D5DB',
        'gray-400': '#9CA3AF',
        'gray-500': '#6B7280',
        'gray-600': '#4B5563',
        'gray-700': '#374151',
        'gray-800': '#1F2937',
        'gray-900': '#111827',
      }
    }
  },
  plugins: []
};
