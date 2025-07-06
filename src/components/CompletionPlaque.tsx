import { motion } from 'framer-motion';

interface CompletionPlaqueProps {
  mode: 'percentage' | 'first' | 'second' | 'third' | 'completed';
  percentage?: number;
  campaignTitle?: string;
  position?: number;
  coinsSpent?: number;
  discount?: number;
}

const CompletionPlaque = ({
  mode,
  percentage = 0,
  campaignTitle = '',
  position,
  coinsSpent,
  discount
}: CompletionPlaqueProps) => {
  const getBackgroundColor = () => {
    switch (mode) {
      case 'first':
        return 'bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-300';
      case 'second':
        return 'bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200';
      case 'third':
        return 'bg-gradient-to-br from-orange-500 via-orange-400 to-orange-300';
      case 'completed':
        return 'bg-gradient-to-br from-green-600 via-green-500 to-green-400';
      default:
        return 'bg-gradient-to-r from-primary to-primary-dark';
    }
  };

  const getTextColor = () => {
    switch (mode) {
      case 'first':
      case 'second':
      case 'third':
      case 'completed':
        return 'text-white';
      default:
        return 'text-white';
    }
  };

  const getRoundedStyle = () => {
    return mode === 'completed' || mode === 'first' || mode === 'second' || mode === 'third'
      ? 'rounded-xl'
      : 'rounded-lg';
  };

  const renderContent = () => {
    if (mode === 'percentage') {
      return (
        <div className="relative z-10">
          <div className={`text-2xl font-extrabold ${getTextColor()} mb-1`}>
            {percentage}%
          </div>
          <div className="text-xs text-green-100 opacity-80">
            PROGRESS
          </div>
        </div>
      );
    }

    if (mode === 'first' || mode === 'second' || mode === 'third') {
      const positionText = mode === 'first' ? '1ST' : mode === 'second' ? '2ND' : '3RD';
      const positionNumber = mode === 'first' ? '1' : mode === 'second' ? '2' : '3';

      return (
        <motion.div
          className="absolute z-10 text-white font-sans font-extrabold text-2xl tracking-wide flex items-baseline"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {positionNumber}<span className="text-lg ml-1">{positionText.slice(1)}</span>
        </motion.div>
      );
    }

    if (mode === 'completed') {
      return (
        <motion.div
          className="absolute z-10 text-white font-serif font-extrabold text-xl tracking-widest"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          COMPLETED
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="w-full">
      {/* Campaign Title */}
      <div className="mb-3">
        <h3 className="font-bold text-gray-900 text-lg truncate">{campaignTitle}</h3>
        {coinsSpent && (
          <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
            <span>Coins Spent: {coinsSpent}</span>
            {discount && <span>Discount: {discount}%</span>}
          </div>
        )}
      </div>

      {/* Plaque */}
      <div className={`w-full h-20 ${getBackgroundColor()} border border-gray-300 ${getRoundedStyle()} relative overflow-hidden flex items-center justify-center shadow-lg`}>
        {/* Progress bar for percentage mode */}
        {mode === 'percentage' && (
          <motion.div
            className="absolute top-0 left-0 h-full bg-white/30"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ ease: "easeOut", duration: 0.8 }}
          />
        )}

        {renderContent()}

        {/* Decorative screws for completed/position plaques */}
        {(mode === 'completed' || mode === 'first' || mode === 'second' || mode === 'third') &&
          ["top-1 left-1", "top-1 right-1", "bottom-1 left-1", "bottom-1 right-1"].map((pos, index) => (
            <motion.div
              key={pos}
              className={`absolute ${pos} w-3 h-3 bg-gray-700 rounded-full border border-gray-500 shadow-inner`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.2 }}
            />
          ))}

        {/* Metallic shine effect */}
        {(mode === 'first' || mode === 'second' || mode === 'third' || mode === 'completed') && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        )}
      </div>
    </div>
  );
};

export default CompletionPlaque;