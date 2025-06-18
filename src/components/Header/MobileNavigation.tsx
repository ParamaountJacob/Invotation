import { Link } from 'react-router-dom';
import { AlignJustify, X, Plus, User, LogOut, FileText, Bell, Users, HelpCircle } from 'lucide-react';

const MobileNavigation = ({
  isMenuOpen,
  setIsMenuOpen,
  isAdmin,
  user,
  coins,
  isBuyCoinsPage,
  handleBuyCoinsClick,
  showAuthModal,
  setShowAuthModal,
  showNotifications,
  setShowNotifications,
  unreadCount,
  location,
  navigate,
  handleSignOut
}) => {
  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <AlignJustify size={24} />}
      </button>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg animate-fade-in">
          <div className="px-4 py-4 space-y-4">
            {!isAdmin && (
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => {
                      if (!user) {
                        setShowAuthModal(true);
                        setIsMenuOpen(false);
                      } else {
                        navigate('/treasure-hoard');
                        setIsMenuOpen(false);
                      }
                    }}
                    className="flex items-center space-x-2"
                  >
                    <span className="font-bold text-gray-800">{user ? coins : 0}</span>
                    <img
                      src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
                      alt="Coin"
                      className="w-6 h-6"
                      loading="lazy"
                    />
                  </button>
                  <button
                    onClick={() => {
                      handleBuyCoinsClick();
                      setIsMenuOpen(false);
                    }}
                    className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isBuyCoinsPage ? 'Back' : 'Buy & Vote'}</span>
                  </button>
                </div>
              </div>
            )}
            
            {!user && (
              <div className="border-b border-gray-200 pb-4 mb-4">
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In / Sign Up</span>
                </button>
              </div>
            )}
            
            {user && (
              <div className="border-b border-gray-200 pb-4 mb-4">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span>Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>
            )}
            
            {isAdmin && (
              <Link
                to="/admin"
                className={`block text-gray-700 hover:text-primary font-medium transition-colors flex items-center space-x-2 ${
                  location.pathname === '/admin' ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="w-5 h-5" />
                <span>Admin Panel</span>
              </Link>
            )}
            
            <Link
              to="/projects"
              className={`block text-gray-700 hover:text-primary font-medium transition-colors ${
                location.pathname.startsWith('/projects') || location.pathname === '/live-campaigns' || location.pathname === '/completed-projects' || location.pathname === '/archives' ? 'text-primary' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            
            {/* Conditional mobile navigation based on admin status */}
            {isAdmin ? (
              <>
                <Link
                  to="/submissions"
                  className={`block text-gray-700 hover:text-primary font-medium transition-colors flex items-center space-x-2 ${
                    location.pathname === '/submissions' ? 'text-primary' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FileText className="w-5 h-5" />
                  <span>Submissions</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/how-it-works"
                  className={`block text-gray-700 hover:text-primary font-medium transition-colors ${
                    location.pathname === '/how-it-works' ? 'text-primary' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </Link>
                
                {user ? (
                  <Link
                    to="/treasure-hoard"
                    className={`block text-gray-700 hover:text-primary font-medium transition-colors flex items-center space-x-2 ${
                      location.pathname === '/treasure-hoard' ? 'text-primary' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Treasure Hoard</span>
                  </Link>
                ) : (
                  <Link
                    to="/submissions"
                    className={`block text-gray-700 hover:text-primary font-medium transition-colors flex items-center space-x-2 ${
                      location.pathname === '/submissions' ? 'text-primary' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Submissions</span>
                  </Link>
                )}
              </>
            )}
            
            <Link
              to="/help"
              className={`block text-gray-700 hover:text-primary font-medium transition-colors flex items-center space-x-2 ${
                location.pathname === '/help' ? 'text-primary' : ''
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Help</span>
            </Link>
            
            {user && (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left text-gray-700 hover:text-primary font-medium transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;