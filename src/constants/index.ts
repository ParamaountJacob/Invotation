/**
 * Application Constants
 * Centralized location for all magic numbers and hardcoded values
 */

// ========================================
// TIMING & DURATIONS (milliseconds)
// ========================================

export const TIMING = {
  // UI Timeouts
  SUCCESS_MESSAGE_TIMEOUT: 3000,        // Success message display duration
  ERROR_MESSAGE_TIMEOUT: 3000,          // Error message display duration
  NOTIFICATION_TIMEOUT: 3000,           // General notification timeout

  // Video & Media
  VIDEO_HOVER_DELAY: 150,               // Delay before video plays on hover
  CONTROLS_HIDE_DELAY: 2000,            // Video controls auto-hide delay

  // Cache Durations
  COIN_CACHE_DURATION: 10000,           // Coin balance cache (10 seconds)
  TREASURE_CACHE_DURATION: 30000,       // Treasure hoard data cache (30 seconds)
  CAMPAIGN_CACHE_DURATION: 60000,       // Campaign data cache (1 minute)

  // Debounce/Throttle
  SEARCH_DEBOUNCE: 300,                 // Search input debounce delay
  SCROLL_THROTTLE: 100,                 // Scroll event throttle
  RESIZE_DEBOUNCE: 200,                 // Window resize debounce
} as const;

// ========================================
// LIMITS & THRESHOLDS
// ========================================

export const LIMITS = {
  // Character Limits
  DESCRIPTION_MAX_LENGTH: 100,          // Campaign card description
  FULL_DESCRIPTION_MAX_LENGTH: 150,     // Full description display
  TITLE_MAX_LENGTH: 60,                 // Title character limit
  COMMENT_MAX_LENGTH: 500,              // Comment character limit
  BIO_MAX_LENGTH: 200,                  // User bio character limit

  // Password Requirements
  PASSWORD_MIN_LENGTH: 6,               // Minimum password length

  // Pagination & Display
  CAMPAIGNS_PER_PAGE: 12,               // Campaigns shown per page
  SUBMISSIONS_PER_PAGE: 10,             // Submissions per page
  COMMENTS_PER_PAGE: 20,                // Comments per page
  PRELOAD_CAMPAIGNS_COUNT: 6,           // Number of campaigns to preload

  // Financial Limits
  MIN_COIN_AMOUNT: 1,                   // Minimum coins to spend
  MAX_COIN_AMOUNT: 1000,                // Maximum coins in single transaction

  // Campaign Thresholds
  ARCHIVE_DAYS_THRESHOLD: 100,          // Days after which inactive campaigns are archived
  LOW_ACTIVITY_DAYS: 30,                // Days to consider campaign as low activity
} as const;

// ========================================
// UI CONSTANTS
// ========================================

export const UI = {
  // Z-Index Values
  Z_INDEX: {
    DROPDOWN: 100,                      // Dropdown menus
    MODAL_BACKDROP: 999,                // Modal backdrop
    MODAL_CONTENT: 1000,                // Modal content
    TOOLTIP: 1001,                      // Tooltips
    STICKY_HEADER: 50,                  // Sticky navigation
    STICKY_FOOTER: 49,                  // Sticky footer
  },

  // Scroll Thresholds
  SCROLL_THRESHOLD_STICKY: 300,         // Pixels scrolled before showing sticky elements
  SCROLL_THRESHOLD_TOP_BUTTON: 400,     // Pixels scrolled before showing scroll-to-top

  // Animation Delays
  STAGGER_DELAY: 100,                   // Stagger animation delay between items

  // Intersection Observer
  INTERSECTION_THRESHOLD: 0.2,          // Threshold for intersection observer
  INTERSECTION_ROOT_MARGIN: '50px',     // Root margin for intersection observer
} as const;

// ========================================
// BUSINESS LOGIC CONSTANTS
// ========================================

export const BUSINESS = {
  // Discount Tiers
  DISCOUNT_TIERS: {
    POSITION_1: 40,                     // 1st place discount percentage
    POSITION_2: 35,                     // 2nd place discount percentage
    POSITION_3: 30,                     // 3rd place discount percentage
    POSITION_4: 27,                     // 4th place discount percentage
    POSITION_5: 25,                     // 5th place discount percentage
    BASE_TIER: 20,                      // Base tier discount (5th place and beyond)
  },

  // Coin Thresholds for Messages
  COIN_THRESHOLDS: {
    ZERO: 0,
    LOW: 10,
    MEDIUM: 50,
    HIGH: 100,
  },

  // Campaign Status Days
  CAMPAIGN_TIMING: {
    MAX_DURATION_DAYS: 100,             // Maximum campaign duration
    WARNING_DAYS_LEFT: 7,               // Show warning when days left
    CRITICAL_DAYS_LEFT: 3,              // Show critical warning
  },
} as const;

// ========================================
// FILE & MEDIA CONSTANTS
// ========================================

export const MEDIA = {
  // File Size Limits (bytes)
  MAX_AVATAR_SIZE: 5 * 1024 * 1024,     // 5MB max avatar size
  MAX_IMAGE_SIZE: 10 * 1024 * 1024,     // 10MB max image size
  MAX_VIDEO_SIZE: 100 * 1024 * 1024,    // 100MB max video size

  // Image Dimensions
  AVATAR_SIZE: 150,                     // Avatar display size (px)
  THUMBNAIL_SIZE: 300,                  // Thumbnail size (px)

  // Supported Formats
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp'] as const,
  SUPPORTED_VIDEO_FORMATS: ['mp4', 'webm', 'mov'] as const,
} as const;

// ========================================
// API CONSTANTS
// ========================================

export const API = {
  // Retry Configuration
  MAX_RETRIES: 3,                       // Maximum API retry attempts
  RETRY_DELAY: 1000,                    // Base retry delay (ms)
  RETRY_MULTIPLIER: 2,                  // Exponential backoff multiplier

  // Timeout Configuration
  REQUEST_TIMEOUT: 30000,               // API request timeout (30 seconds)
  UPLOAD_TIMEOUT: 120000,               // File upload timeout (2 minutes)
} as const;

// ========================================
// VALIDATION PATTERNS
// ========================================

export const VALIDATION = {
  // Email Pattern
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // URL Pattern
  URL_PATTERN: /^https?:\/\/.+/,

  // Slug Pattern (for URLs)
  SLUG_PATTERN: /^[a-z0-9-]+$/,
} as const;

// ========================================
// ERROR MESSAGES
// ========================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INSUFFICIENT_COINS: 'You do not have enough coins for this action.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'File type is not supported.',
} as const;

// ========================================
// SUCCESS MESSAGES
// ========================================

export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password updated successfully!',
  CAMPAIGN_SUPPORTED: 'Campaign supported successfully!',
  COMMENT_POSTED: 'Comment posted successfully!',
  SUBMISSION_CREATED: 'Submission created successfully!',
  COINS_PURCHASED: 'Coins purchased successfully!',
  FILE_UPLOADED: 'File uploaded successfully!',
} as const;

// ========================================
// FEATURE FLAGS
// ========================================

export const FEATURES = {
  ENABLE_COMMENTS: true,                // Enable/disable comment system
  ENABLE_VIDEO_AUTOPLAY: true,          // Enable video autoplay on hover
  ENABLE_CACHE: true,                   // Enable caching system
  ENABLE_ANALYTICS: true,               // Enable analytics tracking
  ENABLE_NOTIFICATIONS: true,           // Enable push notifications
} as const;

// ========================================
// DEFAULT VALUES
// ========================================

export const DEFAULTS = {
  PAGINATION_SIZE: 10,                  // Default pagination size
  COIN_PACKAGE_SIZE: 5,                 // Default coin package
  CAMPAIGN_IMAGE: '/images/default-campaign.jpg',  // Default campaign image
  USER_AVATAR: '/images/default-avatar.jpg',       // Default user avatar
} as const;
