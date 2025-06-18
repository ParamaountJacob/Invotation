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
            <Info className="w-6 h-6 text-primary mr-2" />
            Invotation Development Process
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
            Invotation takes ideas from concept to reality through a structured development process. Your support helps validate market interest and fund initial development.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
              <div className="flex items-start space-x-3 mb-4">
                <div className="bg-primary/10 rounded-full p-1 flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">Idea Validation</h3>
                  <p className="text-blue-700">
                    Your support helps us validate market interest. If the project doesn't reach its goal, your coins will be refunded.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
              <div className="flex items-start space-x-3 mb-4">
                <div className="bg-green-100 rounded-full p-1 flex-shrink-0">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-green-900 mb-1">Prototype Development</h3>
                  <p className="text-green-700">
                    Once funded, we create physical prototypes and refine the design based on community feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm mb-6">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 rounded-full p-1 flex-shrink-0">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-bold text-purple-900 mb-1">Crowdfunding Launch</h3>
                <p className="text-purple-700">
                  The refined product launches on Kickstarter, where you'll receive your promised discount based on your support position.
                </p>
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
                    <p>Our estimated retail price is based on current projections. The final cost may vary based on manufacturing requirements and market conditions.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    <p>The timeline from prototype to final product can vary significantly based on complexity and manufacturing challenges.</p>
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
              <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Invotation's Quality Assurance</h3>
                <p className="text-gray-700 mb-4">
                  Unlike other platforms, Invotation carefully vets all projects before they appear on our platform. Our team of experts evaluates each submission for:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                    <p>Technical feasibility and manufacturing viability</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                    <p>Market potential and consumer demand</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
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