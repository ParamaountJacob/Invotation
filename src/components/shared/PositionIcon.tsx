import { memo } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

interface PositionIconProps {
    position: number;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'compact';
    className?: string;
}

const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
} as const;

const numberSizeClasses = {
    sm: 'w-3 h-3 text-xs',
    md: 'w-4 h-4 text-xs',
    lg: 'w-5 h-5 text-sm',
} as const;

export const PositionIcon = memo<PositionIconProps>(({
    position,
    size = 'md',
    variant = 'default',
    className = ''
}) => {
    const iconSize = sizeClasses[size];
    const numberSize = numberSizeClasses[size];

    // For positions 1-3, show special icons
    switch (position) {
        case 1:
            return <Trophy className={`${iconSize} text-yellow-500 ${className}`} />;
        case 2:
            return <Medal className={`${iconSize} text-gray-400 ${className}`} />;
        case 3:
            return <Award className={`${iconSize} text-orange-500 ${className}`} />;
        default:
            // For positions 4+ or when variant is compact, show numbered circle
            if (variant === 'compact' || position > 3) {
                return (
                    <div className={`${numberSize} bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600 ${className}`}>
                        {position}
                    </div>
                );
            }
            // Default behavior: return null for positions > 3 (for compatibility)
            return null;
    }
});

PositionIcon.displayName = 'PositionIcon';

export default PositionIcon;
