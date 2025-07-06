import { useCallback, useState } from 'react';

export interface ErrorState {
    message: string | null;
    isVisible: boolean;
}

export interface ErrorHandlerReturn {
    error: ErrorState;
    handleError: (error: unknown, fallbackMessage?: string) => void;
    clearError: () => void;
    setError: (message: string) => void;
}

/**
 * Centralized error handling hook that provides consistent error management
 * across the application. Handles type-safe error extraction and logging.
 */
export const useErrorHandler = (): ErrorHandlerReturn => {
    const [error, setErrorState] = useState<ErrorState>({
        message: null,
        isVisible: false,
    });

    const handleError = useCallback((error: unknown, fallbackMessage = 'An error occurred') => {
        let message: string;

        // Extract meaningful error message based on error type
        if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        } else if (error && typeof error === 'object' && 'message' in error) {
            message = String((error as any).message);
        } else {
            message = fallbackMessage;
        }

        // Log error to console for debugging (preserved in all environments)
        console.error('Application Error:', error);

        // Set error state for UI display
        setErrorState({
            message,
            isVisible: true,
        });
    }, []);

    const clearError = useCallback(() => {
        setErrorState({
            message: null,
            isVisible: false,
        });
    }, []);

    const setError = useCallback((message: string) => {
        setErrorState({
            message,
            isVisible: true,
        });
    }, []);

    return {
        error,
        handleError,
        clearError,
        setError,
    };
};

/**
 * Type guard to check if an error is a known API error structure
 */
export const isApiError = (error: unknown): error is { message: string; code?: string } => {
    return (
        error !== null &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as any).message === 'string'
    );
};

/**
 * Utility function to safely extract error message from various error types
 */
export const getErrorMessage = (error: unknown, fallback = 'An error occurred'): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    if (isApiError(error)) {
        return error.message;
    }
    return fallback;
};
