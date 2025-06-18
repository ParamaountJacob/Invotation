import React from 'react';
import { X, Info, CheckCircle, RefreshCcw, Shield } from 'lucide-react';

interface AllOrNothingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AllOrNothingModal: React.FC<AllOrNothingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Info className="w-6 h-6 text-blue-500 mr-2" />
            All-or-Nothing Funding Explained
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-6">
          <p className="text-lg text-gray-700 mb-6">
            Invotation uses an all-or-nothing funding model to ensure that creators get the resources they need to bring their ideas to life, while protecting supporters from unsuccessful projects.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
              <div className="flex items-start space-x-3 mb-4">
                <RefreshCcw className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">Refund Guarantee</h3>
                  <p className="text-blue-700">
                    If the project doesn't reach its coin goal by the deadline, all your coins will be automatically refunded to your account.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
              <div className="flex items-start space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900 mb-1">Successful Projects</h3>
                  <p className="text-green-700">
                    When a project reaches its goal, Invotation brings your idea to reality by handling design, manufacturing, and distribution.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 shadow-sm mb-6">
            <div className="flex items-start space-x-3">
              <Info className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-amber-900 mb-2">Important Notes</h3>
                <ul className="space-y-2 text-amber-800">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <p>Project launch is not guaranteed even if funding is successful. Various factors like technical challenges or market conditions may affect the final outcome.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <p>The timeline from funding to product delivery can vary significantly based on complexity.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <p>Your discount is locked in based on your final position when the campaign ends.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-purple-900 mb-2">Invotation's Quality Assurance</h3>
                <p className="text-purple-700 mb-4">
                  Unlike other platforms, Invotation carefully vets all projects before they appear on our platform. Our team of experts evaluates each submission for:
                </p>
                <ul className="space-y-2 text-purple-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <p>Technical feasibility and manufacturing viability</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <p>Market potential and consumer demand</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <p>Uniqueness and innovation value</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors mx-auto block"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllOrNothingModal;