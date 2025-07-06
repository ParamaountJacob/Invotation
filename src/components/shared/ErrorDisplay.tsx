import { AlertCircle, X } from 'lucide-react';
import { ErrorState } from '../hooks/useErrorHandler';

interface ErrorDisplayProps {
    error: ErrorState;
    onClear: () => void;
    className?: string;
}

/**
 * Reusable error display component that provides consistent error UI
 * across the application. Shows error messages with optional dismiss functionality.
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    error,
    onClear,
    className = ''
}) => {
    if (!error.isVisible || !error.message) {
        return null;
    }

    return (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-4 mb-4 ${className}`}>
            <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                    <p className="text-red-800 text-sm">{error.message}</p>
                </div>
                <button
                    onClick={onClear}
                    className="ml-3 text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Clear error"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ErrorDisplay;
