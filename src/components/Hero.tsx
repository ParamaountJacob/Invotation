import { useEffect, useRef } from 'react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = heroRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="animate-on-scroll mb-6 text-gray-900 opacity-0 leading-tight">
            Vote on Ideas & Change Lives
          </h1>
          <p className="animate-on-scroll opacity-0 text-xl md:text-2xl text-gray-700 mb-8 delay-100">
            Buy coins to vote on real people's ideas → Top voters get up to 40% off → 
            Inventors earn life-changing profits → Everyone wins!
          </p>
          <div className="animate-on-scroll opacity-0 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center delay-200">
            <a href="/buy-coins" className="btn-primary text-lg">
              Buy Coins & Vote
            </a>
            <a href="/submit" className="btn-secondary text-lg">
              Submit Your Idea
            </a>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-on-scroll opacity-0 delay-300">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-lg mb-2">🪙 Buy Coins</h3>
              <p className="text-gray-600">Purchase coins to vote on ideas and secure exclusive discounts</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-lg mb-2">🗳️ Vote on Real Ideas</h3>
              <p className="text-gray-600">Support real people's ideas and help change their lives</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-lg mb-2">💰 Everyone Wins</h3>
              <p className="text-gray-600">You get discounts, inventors earn life-changing income</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-6xl mx-auto mt-16 relative animate-on-scroll opacity-0 delay-300">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Mobile Video */}
          <video
            className="w-full h-full object-contain md:hidden"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src="https://cdn.shopify.com/videos/c/o/v/c67e18d64fa544e3b9c654453652285b.mp4" type="video/mp4" />
          </video>
          
          {/* Desktop Video */}
          <video
            className="hidden md:block w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src="https://cdn.shopify.com/videos/c/o/v/00f65a82f50544ab823ab9e1d84ccdf4.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute -bottom-4 right-4 md:-bottom-8 md:right-8 bg-secondary text-white py-2 px-4 md:py-3 md:px-6 rounded-lg shadow-lg transform rotate-3">
          <p className="font-bold text-sm md:text-base">Now funding on Kickstarter!</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;