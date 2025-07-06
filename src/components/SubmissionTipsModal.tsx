import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lightbulb, Target, Camera, FileText, DollarSign, Shield, CheckCircle } from 'lucide-react';

interface SubmissionTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubmissionTipsModal: React.FC<SubmissionTipsModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tips' | 'example'>('tips');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in overflow-y-auto py-8">
      <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Submission Tips</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'tips'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Helpful Tips
          </button>
          <button
            onClick={() => setActiveTab('example')}
            className={`flex-1 py-3 font-medium transition-colors ${activeTab === 'example'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Example Submission
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {activeTab === 'tips' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-4 mb-4">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Describing Your Idea</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p>Be clear and concise in your description. Focus on the problem your idea solves and how it solves it.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p>Highlight what makes your idea unique. What sets it apart from existing solutions?</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p>Include potential use cases and target users to help us understand the market potential.</p>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-4 mb-4">
                  <Target className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Market Research</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p>Research similar products and explain how yours is different or better.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p>Identify your target market and potential market size.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p>Consider price points of similar products when suggesting retail pricing.</p>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-4 mb-4">
                  <Camera className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Visual Content</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p>Include sketches, diagrams, or mockups to help visualize your idea.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p>If you have a prototype, share photos or videos from multiple angles.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p>3D models (if available) can greatly help us understand your concept.</p>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-4 mb-4">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Cost Considerations</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p>Research potential manufacturing costs if possible.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p>Consider shipping and packaging requirements.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                    <p>Suggest a retail price point that allows for profitable production.</p>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'example' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Example Submission</h3>
                  <p className="text-gray-600">This is how simple your submission can be</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">💡</span>
                          <h4 className="font-bold text-gray-900">Idea Name</h4>
                        </div>
                        <p className="text-gray-700 bg-gray-50 rounded-lg p-3">"SmartMug Pro"</p>
                      </div>

                      <div>
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">🎯</span>
                          <h4 className="font-bold text-gray-900">Quick Pitch</h4>
                        </div>
                        <p className="text-gray-700 bg-gray-50 rounded-lg p-3">"Coffee mug that connects to your phone and keeps coffee at perfect temperature"</p>
                      </div>

                      <div>
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">📋</span>
                          <h4 className="font-bold text-gray-900">Stage</h4>
                        </div>
                        <p className="text-gray-700 bg-gray-50 rounded-lg p-3">"Just thought of it!"</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">📝</span>
                          <h4 className="font-bold text-gray-900">Description</h4>
                        </div>
                        <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm">"I'm tired of my coffee getting cold. What if there was a mug that could keep it warm and let me control the temperature from my phone?"</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="text-xl mr-1">💰</span>
                            <h4 className="font-bold text-gray-900 text-sm">Price</h4>
                          </div>
                          <p className="text-gray-700 bg-gray-50 rounded-lg p-2 text-center">$89</p>
                        </div>
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="text-xl mr-1">💵</span>
                            <h4 className="font-bold text-gray-900 text-sm">Budget</h4>
                          </div>
                          <p className="text-gray-700 bg-gray-50 rounded-lg p-2 text-center">$15K</p>
                        </div>
                      </div>
                    </div>

                    {/* Sketch */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">✏️</span>
                          <h4 className="font-bold text-gray-900">Hand-drawn Sketch</h4>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
                          <img
                            src="https://res.cloudinary.com/digjsdron/image/upload/v1749752320/ChatGPT_Image_Jun_12_2025_01_16_04_PM_fdoc6c.png"
                            alt="Example hand-drawn sketch"
                            className="w-full max-w-32 mx-auto rounded-md"
                            loading="lazy"
                          />
                          <p className="text-xs text-gray-500 text-center mt-2">Example sketch</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Result */}
                  <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-center mb-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                      <h4 className="text-xl font-bold text-green-900">Potential Result</h4>
                    </div>
                    <p className="text-green-800 text-center">
                      From a simple submission like this, you could earn <span className="font-bold">$8 per unit sold</span>.
                      That could be <span className="font-bold">$40,000 or more</span> in ongoing profits!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-primary mr-2" />
                  What Happens After You Submit
                </h3>
                <ol className="space-y-4">
                  <li className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">1</div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Our Team Reviews Your Idea</h4>
                      <p className="text-gray-600">We'll evaluate your submission for market potential, feasibility, and uniqueness.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">2</div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">We Provide Feedback</h4>
                      <p className="text-gray-600">You'll receive feedback on your idea, typically within 2-3 business days.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">3</div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Development Begins</h4>
                      <p className="text-gray-600">If selected, we'll develop your idea at no cost to you, creating professional designs and prototypes.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">4</div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Community Voting</h4>
                      <p className="text-gray-600">Your idea goes live for community voting, where users support it with coins.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">5</div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-1">Launch and Profit</h4>
                      <p className="text-gray-600">When successful, your idea launches on Kickstarter and you earn ongoing profits from every sale.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Don't worry about perfection - we're here to help develop your idea!
          </p>
          <button
            onClick={() => {
              onClose();
              navigate('/submit');
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Submit Your Idea
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionTipsModal;