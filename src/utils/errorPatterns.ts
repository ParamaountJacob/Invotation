/**
 * Documentation of centralized error handling patterns implemented
 * 
 * This file documents the standardized error handling patterns now used
 * throughout the application via the useErrorHandler hook.
 */

/**
 * BEFORE: Inconsistent error handling patterns across the codebase
 * 
 * Pattern 1: Try-catch with manual setError
 * try {
 *   // operation
 * } catch (err: any) {
 *   setError(err.message);
 * }
 * 
 * Pattern 2: Console.error only
 * someOperation().catch(console.error);
 * 
 * Pattern 3: Mixed patterns in same file
 * try {
 *   // operation
 * } catch (err: any) {
 *   console.error('Error:', err);
 *   setError(err.message);
 * }
 */

/**
 * AFTER: Centralized error handling with useErrorHandler hook
 * 
 * Standard Pattern:
 * const { error, handleError, clearError } = useErrorHandler();
 * 
 * try {
 *   clearError(); // Clear previous errors
 *   // operation
 * } catch (err) {
 *   handleError(err, 'Custom fallback message');
 * }
 * 
 * Benefits:
 * - Consistent error message extraction
 * - Automatic console logging for debugging
 * - Unified error display format
 * - Better TypeScript safety
 * - Configurable error handling behavior
 */

/**
 * Files updated to use centralized error handling:
 * 
 * ✅ src/pages/AdminDashboard/CampaignManagement/FAQManager.tsx
 *    - Replaced manual setError calls with handleError
 *    - Updated error display to use error.message
 *    - Added clearError calls before operations
 * 
 * ✅ src/pages/AdminDashboard.tsx
 *    - Updated fetchAllData and handleStatusUpdate functions
 *    - Replaced setError with handleError
 *    - Updated error display in JSX
 * 
 * ✅ src/pages/Projects.tsx
 *    - Updated fetchCampaigns function
 *    - Added clearError to retry button
 *    - Consistent error messaging
 * 
 * Library files (src/lib/*.ts) intentionally keep console.error patterns
 * as they don't manage UI state and need to return success/failure status.
 */

export const ERROR_HANDLING_GUIDELINES = {
    ui_components: "Use useErrorHandler hook for consistent error management",
    library_functions: "Use console.error and return boolean success status",
    async_operations: "Always include fallback error messages",
    user_feedback: "Provide clear, actionable error messages",
    debugging: "Maintain console logging for development debugging"
} as const;
