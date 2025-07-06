import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { memo } from 'react';
import { SubmissionStatus } from '../../constants/submissionStatus';

interface StatusBadgeProps {
    status: SubmissionStatus;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    className?: string;
}

const statusIcons = {
    pending: Clock,
    review: AlertCircle,
    approved: CheckCircle,
    rejected: XCircle,
    development: CheckCircle,
} as const;

const statusStyles = {
    pending: {
        container: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        icon: 'text-yellow-500',
    },
    review: {
        container: 'bg-blue-50 text-blue-800 border-blue-200',
        icon: 'text-blue-500',
    },
    approved: {
        container: 'bg-green-50 text-green-800 border-green-200',
        icon: 'text-green-500',
    },
    rejected: {
        container: 'bg-red-50 text-red-800 border-red-200',
        icon: 'text-red-500',
    },
    development: {
        container: 'bg-purple-50 text-purple-800 border-purple-200',
        icon: 'text-purple-500',
    },
} as const;

const sizeClasses = {
    sm: {
        container: 'px-2 py-1 text-xs',
        icon: 'w-3 h-3',
        spacing: 'space-x-1',
    },
    md: {
        container: 'px-3 py-1 text-sm',
        icon: 'w-4 h-4',
        spacing: 'space-x-2',
    },
    lg: {
        container: 'px-4 py-2 text-base',
        icon: 'w-5 h-5',
        spacing: 'space-x-2',
    },
} as const;

export const StatusBadge = memo<StatusBadgeProps>(({
    status,
    size = 'md',
    showIcon = true,
    className = ''
}) => {
    const Icon = statusIcons[status];
    const styles = statusStyles[status];
    const sizes = sizeClasses[size];

    return (
        <div
            className={`
        inline-flex items-center rounded-full border font-medium capitalize
        ${styles.container}
        ${sizes.container}
        ${showIcon ? sizes.spacing : ''}
        ${className}
      `}
        >
            {showIcon && <Icon className={`${sizes.icon} ${styles.icon}`} />}
            <span>{status}</span>
        </div>
    );
});

StatusBadge.displayName = 'StatusBadge';

export default StatusBadge;
