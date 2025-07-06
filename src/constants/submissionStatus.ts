export type SubmissionStatus = 'pending' | 'review' | 'approved' | 'rejected' | 'development';

export const SUBMISSION_STATUS = {
    PENDING: 'pending' as const,
    REVIEW: 'review' as const,
    APPROVED: 'approved' as const,
    REJECTED: 'rejected' as const,
    DEVELOPMENT: 'development' as const,
} as const;

export const SUBMISSION_STATUS_LABELS = {
    [SUBMISSION_STATUS.PENDING]: 'Pending',
    [SUBMISSION_STATUS.REVIEW]: 'Review',
    [SUBMISSION_STATUS.APPROVED]: 'Approved',
    [SUBMISSION_STATUS.REJECTED]: 'Rejected',
    [SUBMISSION_STATUS.DEVELOPMENT]: 'Development',
} as const;
