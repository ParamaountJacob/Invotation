/**
 * Production-safe logging utility
 * 
 * This logger provides consistent logging behavior across environments:
 * - Development: Full logging for debugging
 * - Production: Minimal logging to reduce performance impact
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
    debug: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    log: (...args: any[]) => void; // Alias for debug
}

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Create a logger instance with optional prefix for better debugging
 */
export const createLogger = (prefix?: string): Logger => {
    const formatMessage = (level: LogLevel, ...args: any[]) => {
        const timestamp = new Date().toISOString();
        const prefixStr = prefix ? `[${prefix}]` : '';
        return [`[${timestamp}]${prefixStr}[${level.toUpperCase()}]`, ...args];
    };

    return {
        debug: (...args: any[]) => {
            if (isDevelopment) {
                console.log(...formatMessage('debug', ...args));
            }
        },

        info: (...args: any[]) => {
            if (isDevelopment) {
                console.info(...formatMessage('info', ...args));
            }
        },

        warn: (...args: any[]) => {
            // Keep warnings in production for important issues
            console.warn(...formatMessage('warn', ...args));
        },

        error: (...args: any[]) => {
            // Always keep errors for debugging production issues
            console.error(...formatMessage('error', ...args));
        },

        log: (...args: any[]) => {
            // Alias for debug - only in development
            if (isDevelopment) {
                console.log(...formatMessage('debug', ...args));
            }
        }
    };
};

/**
 * Default logger instance for general use
 */
export const logger = createLogger();

/**
 * Component-specific loggers for better debugging
 */
export const imageLogger = createLogger('ImageProcessor');
export const videoLogger = createLogger('VideoPlayer');
export const coinLogger = createLogger('CoinSystem');
export const authLogger = createLogger('Authentication');

export default logger;
