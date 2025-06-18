import { useState, useEffect } from 'react';
import { Send, User, Calendar, MessageSquare, Search } from 'lucide-react';
import { Message, Profile } from '../../types';
import MessagingModal from '../../components/MessagingModal';
import { supabase } from '../../lib/supabase';

interface AdminMessagingProps {
  messages: (Message & { fromProfile: Profile; toProfile: Profile })[];
  onSendMessage: (toUserId: string, content: string) => void;
  onMarkAsRead: (messageId: string) => void;
}

const AdminMessaging = ({ messages, onSendMessage, onMarkAsRead }: AdminMessagingProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [filterUnread, setFilterUnread] = useState(false);
  const [showMessagingModal, setShowMessagingModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const filteredMessages = messages.filter(message => {
    if (filterUnread && message.read) return false;
    return true;
  });

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    
    getCurrentUser();
  }, []);

  // Get unique users for the dropdown
  const uniqueUsers = Array.from(
    new Map(
      messages.map(msg => [msg.from_user_id, msg.fromProfile])
    ).values()
  );

  const handleOpenMessaging = (userId: string) => {
    setSelectedUserId(userId);
    setShowMessagingModal(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Admin Messaging</h2>
      
      {/* Send Message Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Send Message</h3>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select User to Message
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleOpenMessaging(user.id)}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-primary/5 hover:border-primary transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <span>{user.full_name?.charAt(0) || user.email.charAt(0)}</span>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium">{user.full_name || 'No name'}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Recent Messages</h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filterUnread}
                onChange={(e) => setFilterUnread(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-600">Show unread only</span>
            </label>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredMessages.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No messages found.</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !message.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {message.fromProfile.avatar_url ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={message.fromProfile.avatar_url}
                          alt=""
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {message.fromProfile.full_name || 'No name'}
                      </p>
                      <p className="text-xs text-gray-500">{message.fromProfile.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(message.created_at).toLocaleDateString()}
                    </div>
                    {!message.read && (
                      <button
                        onClick={() => onMarkAsRead(message.id)}
                        className="text-xs text-primary hover:text-primary-dark"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700">{message.content}</p>
                
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleOpenMessaging(message.fromProfile.id)}
                    className="text-sm text-primary hover:text-primary-dark flex items-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Reply
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Messaging Modal */}
      {showMessagingModal && (
        <MessagingModal
          isOpen={showMessagingModal}
          onClose={() => setShowMessagingModal(false)}
          selectedUserId={selectedUserId}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default AdminMessaging;