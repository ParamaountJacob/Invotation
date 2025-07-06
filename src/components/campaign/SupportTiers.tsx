import React, { useState } from 'react';
import { ArrowRight, AlertCircle, X, Check, Info } from 'lucide-react';
import PositionIcon from '../shared/PositionIcon';

interface TierInfo {
  position: number;
  discount: number;
  supporter: any;
  coinsRequired: number;
  isUserPosition: boolean;
}

interface SupportTiersProps {
  campaign: any;
  supporters: any[];
  user: any;
  userSupport: any;
  coins: number;
  handleSupport: () => void;
  supportAmount: number;
  setSupportAmount: (amount: number) => void;
  isSupporting: boolean;
}

const SupportTiers: React.FC<SupportTiersProps> = ({
  campaign,
  supporters,
  user,
  userSupport,
  coins,
  handleSupport,
  supportAmount,
  setSupportAmount,
  isSupporting
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tierToConfirm, setTierToConfirm] = useState<{ position: number, coins: number, discount: number } | null>(null);

  // Base tier (position 5) - everyone gets this with 1 coin
  const baseTier: TierInfo = {
    position: 5,
    discount: 20,
    supporter: supporters.find(s => s.position === 5),
    coinsRequired: 1, // Always 1 coin for base tier
    isUserPosition: userSupport?.position === 5
  };

  // Special tiers (positions 1-4) - higher positions with better discounts
  const specialTiers: TierInfo[] = Array.from({ length: 4 }, (_, i) => {
    const position = i + 1; // Position (1, 2, 3, 4)
    const existingSupporter = supporters.find(s => s.position === position);

    // Calculate discount based on position
    let discount;
    if (position === 1) discount = 40;
    else if (position === 2) discount = 35;
    else if (position === 3) discount = 30;
    else if (position === 4) discount = 27;

    return {
      position,
      discount,
      supporter: existingSupporter,
      coinsRequired: existingSupporter ? existingSupporter.coins_spent + 1 : 1,
      isUserPosition: userSupport?.position === position
    };
  });

  // Combine tiers with base tier first, then special tiers in descending order
  const allTiers = [baseTier, ...specialTiers.reverse()];



  // Get background color based on position
  const getPositionColor = (position: number) => {
    switch (position) {
      case 5: // Base tier
        return 'bg-white border-gray-200';
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300';
      default:
        return 'bg-white border-gray-300';
    }
  };

  // Get discount badge style based on position
  const getDiscountBadgeStyle = (position: number) => {
    switch (position) {
      case 5: // Base tier
        return 'bg-blue-500 text-white';
      case 1:
        return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-500 to-amber-600 text-white';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    }
  };

  // Handle tier selection
  const handleTierSelect = (position: number, coinsRequired: number, discount: number) => {
    setSupportAmount(coinsRequired);

    // Show confirmation modal for all positions
    setTierToConfirm({ position, coins: coinsRequired, discount });
    setShowConfirmModal(true);
  };

  // Check if user can afford the selected tier
  const canAffordTier = (coinsRequired: number) => {
    return coins >= coinsRequired;
  };

  // Confirm tier selection and proceed with support
  const confirmTierSelection = () => {
    if (tierToConfirm) {
      setSupportAmount(tierToConfirm.coins);
      handleSupport();
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Support Tiers</h3>
        <p className="text-gray-600 mb-4">
          Secure your position to get the best discount when this product launches. Higher positions get bigger discounts!
        </p>

        {/* User's current position */}
        {userSupport && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PositionIcon position={userSupport.position || 999} size="sm" variant="compact" />
                <span className="font-medium text-green-800">
                  Your current position: #{userSupport.position || 'Unranked'}
                </span>
              </div>
              <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {userSupport.discount_percentage || 20}% OFF
              </span>
            </div>
            <p className="text-sm text-green-700 mt-2">
              You've supported with {userSupport.coins_spent} coins total
            </p>
          </div>
        )}

        {/* Available coins */}
        {user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">Your available coins</span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-blue-800">{coins}</span>
                <img
                  src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                  alt="Coin"
                  className="w-5 h-5"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Support Tiers List - Kickstarter Style */}
      <div className="space-y-8 p-6">
        {/* Base tier first, then special tiers */}
        {/* Base Tier - Special Styling */}
        <div
          key={baseTier.position}
          className={`${baseTier.isUserPosition ? 'border-green-500 ring-1 ring-green-500' : ''} rounded-xl transition-all duration-300 overflow-hidden`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                {baseTier.position}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Base Support Tier</h4>
              <div className="bg-blue-500 px-3 py-0.5 rounded-full text-xs font-bold inline-block text-white">
                20% OFF
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-2 text-green-600 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p>Everyone gets this tier with 1 coin</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-start space-x-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">
                20% discount on final retail price (${campaign.estimatedRetailPrice})
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">
                Early access when the product launches
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">
                Your name in the supporter credits
              </p>
            </div>
          </div>

          {user && !userSupport && (
            <button
              onClick={() => handleTierSelect(baseTier.position, 1, baseTier.discount)}
              disabled={isSupporting || coins < 1}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <img
                src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                alt="Coin"
                className="w-5 h-5"
                loading="lazy"
              />
              <span>1 coin to support</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>

        {/* Special Tiers */}
        {specialTiers.map((tier) => (
          <div
            key={tier.position}
            className={`${getPositionColor(tier.position)} ${tier.isUserPosition ? 'border-green-500 ring-1 ring-green-500' : 'border'
              } rounded-xl shadow-md transition-all duration-300 overflow-hidden`}
          >
            {/* Tier Header */}
            <div className="p-5 border-b border-gray-200 bg-white bg-opacity-80">
              <div className="flex justify-between items-center">              <div className="flex items-center space-x-3">
                <PositionIcon position={tier.position} size="lg" />
                <div>
                  <h4 className="font-bold text-gray-900">
                    Position #{tier.position}
                  </h4>
                  <div className={`${getDiscountBadgeStyle(tier.position)} px-3 py-0.5 rounded-full text-xs font-bold inline-block mt-1`}>
                    {tier.discount}% OFF
                  </div>
                </div>
              </div>

                {tier.isUserPosition && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
                    Your Position
                  </div>
                )}
              </div>
            </div>

            {/* Tier Content */}
            <div className="p-5">
              <div className="mb-4">
                {tier.supporter ? (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold flex-shrink-0">
                      {tier.supporter.profiles?.full_name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {tier.supporter.profiles?.full_name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Currently holds this position with {tier.supporter.coins_spent} coins
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-green-600 font-medium">
                      {tier.position === 5 ? 'Everyone gets this tier with 1 coin' : 'Available! No supporter yet'}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    {tier.discount}% discount on final retail price (${campaign.estimatedRetailPrice})
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Early access when the product launches
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Your name in the supporter credits
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                {user && !tier.isUserPosition && tier.position !== 5 && (
                  canAffordTier(tier.coinsRequired) ? (
                    <button
                      onClick={() => handleTierSelect(tier.position, tier.coinsRequired, tier.discount)}
                      disabled={isSupporting}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <img
                        src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                        alt="Coin"
                        className="w-5 h-5"
                        loading="lazy"
                      />
                      <span>{tier.supporter ? `${tier.coinsRequired} coins to take this spot` : '1 coin to secure'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="w-full text-sm text-red-600 flex items-center justify-center space-x-1 py-3">
                      <AlertCircle className="w-4 h-4" />
                      <span>Need {tier.coinsRequired - coins} more coins</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Confirm Your Support</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-6 border border-blue-200 shadow-sm">
              <div className="flex items-start space-x-4">
                <Info className="w-8 h-8 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-blue-900 mb-2">Support Details</h4>
                  <p className="text-blue-800 mb-4">
                    You're about to spend <span className="font-bold">{tierToConfirm?.coins} coins</span> to
                    {tierToConfirm?.position ? ` secure position #${tierToConfirm.position}` : ' support this project'}.
                  </p>

                  <div className="bg-white bg-opacity-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-800">Your coins:</span>
                      <span className="font-bold text-blue-900">{coins}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-800">This support:</span>
                      <span className="font-bold text-blue-900">-{tierToConfirm?.coins}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                      <span className="text-blue-800">Remaining coins:</span>
                      <span className="font-bold text-blue-900">{coins - (tierToConfirm?.coins || 0)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-2">
                    <div className={`${getDiscountBadgeStyle(tierToConfirm?.position || 0)} px-3 py-1 rounded-full text-sm font-bold`}>
                      {tierToConfirm?.discount}% OFF
                    </div>
                    <span className="text-blue-800">
                      discount secured on final product
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmTierSelection}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                Confirm Support
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTiers;