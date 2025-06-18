import { useEffect, useRef } from 'react';
import { Lightbulb, Handshake, Hammer, Users, Rocket, DollarSign, ArrowRight, CheckCircle, Coins, MessageSquare, Award, TrendingUp } from 'lucide-react';

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-fade-in');
            }, index * 100);
          }
        });
      },
      { threshold: 0.2, rootMargin: '50px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const steps = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Sarah Submits Idea',
      subtitle: 'Smart coffee mug concept',
      description: 'Simple form + hand-drawn sketch',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: 'We Partner',
      subtitle: '15% profit share',
      description: '$0 upfront, we cover $15K development',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: <Hammer className="w-8 h-8" />,
      title: 'We Build',
      subtitle: 'Professional concept',
      description: '3D renders, prototypes, app mockups',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Votes',
      subtitle: '847 supporters',
      description: 'Top voter gets 40% off',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Kickstarter Launch',
      subtitle: '$340K raised',
      description: 'Voters get promised discounts',
      color: 'from-red-400 to-red-600'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Sarah Earns',
      subtitle: '$40K+ so far',
      description: '$8 per mug, ongoing profits',
      color: 'from-emerald-400 to-emerald-600'
    }
  ];

  return (
    <section
      id="how-it-works"
      className="section-padding bg-gradient-to-br from-gray-50 to-white"
      ref={sectionRef}
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="animate-on-scroll opacity-0 mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <Coins className="w-4 h-4 mr-2" />
              How Voting Works
            </span>
          </div>
          <h2 className="animate-on-scroll opacity-0 text-4xl md:text-5xl font-black text-gray-900 mb-6 delay-100">
            Vote, Influence & <span className="text-primary">Save Money</span>
          </h2>
          <p className="animate-on-scroll opacity-0 max-w-2xl mx-auto text-xl text-gray-600 delay-200">
            Your votes shape product development and secure exclusive discounts
          </p>
        </div>

        {/* Voting Process */}
        <div className="animate-on-scroll opacity-0 delay-300 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Coins className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">1. Buy Coins & Vote</h3>
              <p className="text-gray-600 text-center mb-4">Purchase coins and vote on your favorite projects. The more coins you spend, the higher your position.</p>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  <p>Coins start at just $0.99 each</p>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  <p>Vote on multiple projects or go all-in on one</p>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  <p>Higher positions = bigger discounts (up to 40% off!)</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">2. Share Suggestions</h3>
              <p className="text-gray-600 text-center mb-4">Influence product development by sharing your ideas and feedback in the community.</p>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  <p>Suggest features, colors, or improvements</p>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  <p>Your voting power determines your influence</p>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  <p>Agree or disagree with other community members</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">3. Secure Your Discount</h3>
              <p className="text-gray-600 text-center mb-4">When the product launches, you'll receive your exclusive discount based on your position.</p>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  <p>1st place: 40% off retail price</p>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  <p>2nd place: 35% off retail price</p>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  <p>Everyone gets at least 20% off!</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Real Example */}
        <div className="animate-on-scroll opacity-0 delay-400 mb-20">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 border border-primary/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Voting Example</h3>
              <p className="text-gray-600">See how our community influences product development</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <h4 className="text-lg font-bold">Top Supporter Rankings</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">1</div>
                      <span className="font-bold">Michael S.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">25 coins</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-xs">40% OFF</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-300 to-gray-400 text-white rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">2</div>
                      <span className="font-bold">Jennifer K.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">20 coins</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-xs">35% OFF</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">3</div>
                      <span className="font-bold">David R.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">15 coins</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-xs">30% OFF</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">128 total supporters • $300 retail price</p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <h4 className="text-lg font-bold">Top Community Suggestions</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800">"Add a rainfall + regular shower combo option"</p>
                      <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded text-xs font-bold">Score: +42</span>
                    </div>
                    <p className="text-xs text-gray-500">Suggested by Michael S. • Implemented in final design</p>
                  </div>
                  
                  <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800">"Include multiple color options (matte black, brushed nickel)"</p>
                      <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded text-xs font-bold">Score: +38</span>
                    </div>
                    <p className="text-xs text-gray-500">Suggested by Jennifer K. • Implemented in final design</p>
                  </div>
                  
                  <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-800">"Add built-in Bluetooth speakers"</p>
                      <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded text-xs font-bold">Score: -12</span>
                    </div>
                    <p className="text-xs text-gray-500">Suggested by Thomas W. • Not implemented</p>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">87 total suggestions • 5 implemented features</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="animate-on-scroll opacity-0 delay-500 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <DollarSign className="w-4 h-4 mr-2" />
              For Inventors
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              How Sarah Made <span className="text-primary">$40,000</span>
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              From "smart coffee mug" idea to ongoing profits in 6 simple steps
            </p>
          </div>
        </div>

        {/* Process Flow */}
        <div className="animate-on-scroll opacity-0 delay-600 mb-20">
          <div className="relative">
            {/* Desktop Flow */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-6 gap-4 relative">
                {/* Connection Lines */}
                <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-blue-400 via-purple-400 via-green-400 via-red-400 to-emerald-400 opacity-30"></div>
                
                {steps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                        {step.icon}
                      </div>
                      
                      {/* Content */}
                      <div className="text-center">
                        <h3 className="font-bold text-gray-900 mb-1 text-sm">{step.title}</h3>
                        <p className="text-primary font-semibold text-xs mb-2">{step.subtitle}</p>
                        <p className="text-gray-600 text-xs leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    {index < steps.length - 1 && (
                      <div className="absolute top-16 -right-2 z-10">
                        <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                          <ArrowRight className="w-2 h-2 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Flow */}
            <div className="lg:hidden space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white flex-shrink-0`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-primary font-semibold text-sm mb-1">{step.subtitle}</p>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowRight className="w-5 h-5 text-gray-300 rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sarah's Submission Details */}
        <div className="animate-on-scroll opacity-0 delay-700 mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Example Submission</h3>
              <p className="text-gray-600 text-lg">This is how simple your submission can be</p>
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
                  <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                  <h4 className="text-2xl font-bold text-green-900">Result</h4>
                </div>
                <p className="text-green-800 text-center text-lg">
                  From a simple submission like this, you could earn <span className="font-bold">$8 per unit sold</span>. 
                  That could be <span className="font-bold">$40,000 or more</span> in ongoing profits!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="animate-on-scroll opacity-0 delay-800 text-center">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h3>
            <p className="text-xl text-primary-light mb-8 max-w-2xl mx-auto">
              Vote on projects to secure discounts or submit your own idea to earn profits.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/buy-coins" 
                className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
              >
                Buy Coins & Vote
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a 
                href="/submit" 
                className="inline-flex items-center bg-primary-dark text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark/80 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
              >
                Submit Your Idea
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;