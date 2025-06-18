import { TrendingUp, Lightbulb, DollarSign } from 'lucide-react';

const HowItWorksExample = () => {
  return (
    <div className="mt-24 mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
          <DollarSign className="w-4 h-4 mr-2" />
          How Easy It Is To Make Money
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
          How Sarah Made <span className="text-primary">$40,000</span>
        </h2>
        <p className="text-gray-600">
          From "smart coffee mug" idea to ongoing profits in 6 simple steps
        </p>
      </div>
      
      {/* Process Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-12">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
            <Lightbulb className="w-7 h-7" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-900 mb-1">Sarah Submits Idea</h3>
            <p className="text-primary font-semibold text-sm mb-1">Smart coffee mug concept</p>
            <p className="text-gray-600 text-xs leading-relaxed">Simple form + hand-drawn sketch</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <path d="M16 16h6"></path><path d="M14 16H8"></path><path d="M2 16h2"></path>
              <path d="M9 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0"></path>
              <path d="M17 10h3"></path><path d="M4 10h1"></path>
              <path d="M2 4h20"></path><path d="M2 22h20"></path>
            </svg>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-900 mb-1">We Partner</h3>
            <p className="text-primary font-semibold text-sm mb-1">15% profit share</p>
            <p className="text-gray-600 text-xs leading-relaxed">$0 upfront, we cover $15K development</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <path d="M2 12h20"></path>
              <path d="M16 6l6 6-6 6"></path>
              <path d="M8 18l-6-6 6-6"></path>
            </svg>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-900 mb-1">We Build</h3>
            <p className="text-primary font-semibold text-sm mb-1">Professional concept</p>
            <p className="text-gray-600 text-xs leading-relaxed">3D renders, prototypes, app mockups</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <path d="M12 13V7"></path>
              <path d="M15 10l-3 3-3-3"></path>
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            </svg>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-900 mb-1">People Vote</h3>
            <p className="text-primary font-semibold text-sm mb-1">847 supporters</p>
            <p className="text-gray-600 text-xs leading-relaxed">Top voter gets 40% off</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <path d="M22 5h-6"></path>
              <path d="M7 16l-5 5 5-5Z"></path>
              <path d="M17 11l5 5-5-5Z"></path>
              <path d="M2 11l5 5"></path>
              <path d="M12 5l5 5"></path>
              <path d="M7 5l5 5"></path>
            </svg>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-900 mb-1">Kickstarter Launch</h3>
            <p className="text-primary font-semibold text-sm mb-1">$340K raised</p>
            <p className="text-gray-600 text-xs leading-relaxed">Voters get promised discounts</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
              <path d="M12 18V6"></path>
            </svg>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-gray-900 mb-1">Sarah Earns</h3>
            <p className="text-primary font-semibold text-sm mb-1">$40K+ so far</p>
            <p className="text-gray-600 text-xs leading-relaxed">$8 per mug, ongoing profits</p>
          </div>
        </div>
      </div>
      
      {/* Sarah's Submission Details */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Example Submission</h3>
          <p className="text-gray-600">This is how simple your submission can be</p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
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
            <div className="space-y-6">
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
            <div className="space-y-6">
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
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-600 mr-3">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h4 className="text-2xl font-bold text-green-900">Potential Result</h4>
            </div>
            <p className="text-green-800 text-center text-lg">
              From a simple submission like this, you could earn <span className="font-bold">$8 per unit sold</span>. 
              That could be <span className="font-bold">$40,000 or more</span> in ongoing profits!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksExample;