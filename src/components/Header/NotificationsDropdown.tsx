import { Bell } from 'lucide-react';

const NotificationsDropdown = ({
  notifications,
  unreadCount,
  markAllAsRead,
  markNotificationAsRead,
  getNotificationIcon,
  navigate,
  setShowNotifications,
}) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-primary hover:text-primary-dark"
          >
            Mark all read
          </button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-500">
          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No new notifications</p>
        </div>
      ) : (
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
              onClick={() => {
                markNotificationAsRead(notification.id);
                navigate(notification.link);
                setShowNotifications(false);
              }}
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.time).toLocaleDateString()} at{' '}
                    {new Date(notification.time).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;