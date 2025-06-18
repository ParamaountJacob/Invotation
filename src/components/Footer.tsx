import Logo from './Logo';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import { useState } from 'react';
import SubmissionTipsModal from './SubmissionTipsModal';

const Footer = () => {
  const [showTipsModal, setShowTipsModal] = useState(false);

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-4">
              <img 
                src="https://cdn.shopify.com/s/files/1/0749/7403/6183/files/Invotation_Logo_Design_white.webp?v=1746324482"
                alt="Invotation"
                className="h-8"
                loading="lazy"
              />
            </div>
            <p className="text-gray-400 mb-6">
              Turning great ideas into reality. Your votes help real people bring their product concepts to market while securing exclusive discounts for yourself.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/projects" className="text-gray-400 hover:text-white transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/submit" className="text-gray-400 hover:text-white transition-colors">
                  Submit Your Idea & Earn
                </a>
              </li>
              <li>
                <a href="/buy-coins" className="text-gray-400 hover:text-white transition-colors">
                  Buy Coins & Vote
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Inventor FAQ
                </a>
              </li>
              <li>
                <button 
                  onClick={() => setShowTipsModal(true)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Submission Tips
                </button>
              </li>
              <li>
                <a href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Backer Guide
                </a>
              </li>
              <li>
                <a href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                  Sitemap
                </a>
              </li>
              <li>
                <a href="/projects" className="text-gray-400 hover:text-white transition-colors">
                  All Projects
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>2501 Chatham Rd Suite R</li>
              <li>Springfield, IL 62704</li>
              <li className="pt-2">
                <a href="mailto:hello@invotation.com" className="text-primary hover:text-primary-light transition-colors">
                  invotation@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+1346.266.1456" className="text-gray-400 hover:text-white transition-colors">
                  (346) 266-1456
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Invotation Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="hover:text-gray-300 transition-colors">
              Cookies Policy
            </Link>
          </div>
        </div>
      </div>
      
      {/* Submission Tips Modal */}
      <SubmissionTipsModal 
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
      />
    </footer>
  );
};

export default Footer;