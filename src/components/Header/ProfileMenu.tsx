import { Link } from 'react-router-dom';
import { Settings, Users, LogOut } from 'lucide-react';

const ProfileMenu = ({ profile, setShowProfileMenu, handleSignOut, navigate }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
      <Link
        to="/settings"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
        onClick={() => {
          setShowProfileMenu(false);
          navigate('/settings');
        }}
      >
        <Settings className="w-4 h-4" />
        <span>Settings</span>
      </Link>
      {profile?.is_admin && (
        <>
          <div className="border-t border-gray-100 my-1"></div>
          <Link
            to="/admin"
            className="block px-4 py-2 text-primary hover:bg-primary/5 font-medium flex items-center space-x-2"
            onClick={() => {
              setShowProfileMenu(false);
              navigate('/admin');
            }}
          >
            <Users className="w-4 h-4" />
            <span>Admin Panel</span>
          </Link>
        </>
      )}
      <div className="border-t border-gray-100 my-1"></div>
      <button
        onClick={handleSignOut}
        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default ProfileMenu;