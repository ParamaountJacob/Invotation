import { Link } from 'react-router-dom';
import { Users, FileText, HelpCircle, Bell, Settings, LogOut } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileMenu from './ProfileMenu';

const DesktopNavigation = ({ 
  profileMenuRef,
  notificationsRef,
  isAdmin,
  user,
  coins,
  location,
  isBuyCoinsPage,
  handleBuyCoinsClick,
  showAuthModal,
  setShowAuthModal,
  unreadCount,
  showNotifications,
  setShowNotifications,
  notifications,
  markNotificationAsRead,
  markAllAsRead,
  getNotificationIcon,
  navigate,
  profile,
  handleAuth,
  showProfileMenu,
  setShowProfileMenu,
  handleSignOut
}) => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      {/* Coin Display - Hidden for admins */}
      {!isAdmin && (
        <div className="flex items-center space-x-4">
          {/* Coin Display */}
          <button
            onClick={() => {
              if (!user) {
                setShowAuthModal(true);
              } else {
                navigate('/treasure-hoard');
              }
            }}
            className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <span className="font-bold text-gray-800">{user ? coins : 0}</span>
            <img
              src="https://res.cloudinary.com/digjsdron/image/upload/v1749679800/Coin_fro3cf.webp"
              alt="Coin"
              className="w-6 h-6"
              loading="lazy"
            />
          </button>
          
          {/* Buy Coins Button */}
          <button
            onClick={handleBuyCoinsClick}
            className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors flex items-center space-x-2 animate-pulse"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            <span>{isBuyCoinsPage ? 'Back' : 'Buy Coins & Vote'}</span>
          </button>
        </div>
      )}
      
      {isAdmin && (
        <Link
          to="/admin"
          className={`text-gray-700 hover:text-primary font-medium transition-colors flex items-center space-x-2 ${
            location.pathname === '/admin' ? 'text-primary' : ''
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Admin Panel</span>
        </Link>
      )}
      
      <Link
        to="/projects"
        className={`text-gray-700 hover:text-primary font-medium transition-colors ${
          location.pathname.startsWith('/projects') || location.pathname === '/live-campaigns' || location.pathname === '/completed-projects' || location.pathname === '/archives' ? 'text-primary' : ''
        }`}
      >
        Projects
      </Link>
      
      {/* Conditional navigation based on admin status */}
      {isAdmin ? (
        <>
          <Link
            to="/submissions"
            className={`text-gray-700 hover:text-primary font-medium transition-colors flex items-center space-x-2 ${
              location.pathname === '/submissions' ? 'text-primary' : ''
            }`}
            onClick={() => setShowProfileMenu(false)}
          >
            <FileText className="w-5 h-5" />
            <span>Submissions</span>
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/how-it-works"
            className={`text-gray-700 hover:text-primary font-medium transition-colors ${
              location.pathname === '/how-it-works' ? 'text-primary' : ''
            }`}
            onClick={() => setShowProfileMenu(false)}
          >
            How It Works
          </Link>
          
          <Link
            to={user ? "/treasure-hoard" : "/submissions"}
            className={`text-gray-700 hover:text-primary font-medium transition-colors ${
              location.pathname === '/treasure-hoard' || location.pathname === '/submissions' ? 'text-primary' : ''
            }`}
            onClick={() => setShowProfileMenu(false)}
          >
            {user ? 'Treasure Hoard' : 'Submissions'}
          </Link>
        </>
      )}
      
      <Link
        to="/help"
        className={`text-gray-700 hover:text-primary font-medium transition-colors flex items-center space-x-2 ${
          location.pathname === '/help' ? 'text-primary' : ''
        }`}
        onClick={() => setShowProfileMenu(false)}
      >
        <span>Help</span>
      </Link>
      
      {user && (
        <div className="flex items-center space-x-4">
          {/* Notifications Bell */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Notifications"
            ref={notificationsRef}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <NotificationsDropdown 
                notifications={notifications}
                unreadCount={unreadCount}
                markAllAsRead={markAllAsRead}
                markNotificationAsRead={markNotificationAsRead}
                getNotificationIcon={getNotificationIcon}
                navigate={navigate}
                setShowNotifications={setShowNotifications}
              />
            )}
          </button>

          {/* Profile Button */}
          <button
            onClick={handleAuth}
            className="relative group flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            title="View Profile"
            ref={profileMenuRef}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              profile?.is_admin 
                ? 'bg-gradient-to-br from-yellow-600 via-yellow-700 to-yellow-800 ring-2 ring-yellow-500 shadow-lg'
                : profile?.avatar_url ? 'bg-transparent' : 'bg-primary'
            }`}>
              {profile?.is_admin ? (
                <img
                  src="https://res.cloudinary.com/digjsdron/image/upload/v1749767827/ChatGPT_Image_Jun_12_2025_05_35_50_PM_ntiox3.png"
                  alt="Admin Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          
            {/* Profile Menu */}
            {showProfileMenu && (
              <ProfileMenu 
                profile={profile}
                setShowProfileMenu={setShowProfileMenu}
                handleSignOut={handleSignOut}
                navigate={navigate}
              />
            )}
          </button>
        </div>
      )}
    </nav>
  );
};

export default DesktopNavigation;