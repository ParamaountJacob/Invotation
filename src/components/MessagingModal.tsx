import { useState, useEffect, useRef } from 'react';
import { X, Send, User, MessageSquare, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile, Message } from '../types';

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUserId?: string;
  currentUser: any;
}

interface MessageWithProfile extends Message {
  fromProfile?: Profile;
  toProfile?: Profile;
}

const MessagingModal: React.FC<MessagingModalProps> = ({
  isOpen,
  onClose,
  selectedUserId,
  currentUser
}) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      checkIfAdmin();
      if (selectedUserId) {
        // Find and select the user
        fetchUserById(selectedUserId);
      }
    }
  }, [isOpen, selectedUserId]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkIfAdmin = async () => {
    if (!currentUser) return;

    try {
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', currentUser.id)
        .single();

      setIsAdmin(data?.is_admin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUserById = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) {
        setSelectedUser(data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      // If current user is admin, get all users
      // If current user is not admin, only get admin users
      if (isAdmin) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('full_name', { ascending: true });

        if (error) throw error;

        // Filter out current user
        const filteredUsers = (data || []).filter(user => user.id !== currentUser?.id);
        setUsers(filteredUsers);
      } else {
        // Only get admin users
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('is_admin', true)
          .order('full_name', { ascending: true });

        if (error) throw error;

        // Filter out current user (in case they're an admin)
        const filteredUsers = (data || []).filter(user => user.id !== currentUser?.id);
        setUsers(filteredUsers);
      }

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedUser || !currentUser) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          fromProfile:profiles!from_user_id(*),
          toProfile:profiles!to_user_id(*)
        `)
        .or(`and(from_user_id.eq.${currentUser.id},to_user_id.eq.${selectedUser.id}),and(from_user_id.eq.${selectedUser.id},to_user_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      await markMessagesAsRead();
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!selectedUser || !currentUser) return;

    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('from_user_id', selectedUser.id)
        .eq('to_user_id', currentUser.id)
        .eq('read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !currentUser || sending) return;

    try {
      setSending(true);
      const { error } = await supabase
        .from('messages')
        .insert({
          from_user_id: currentUser.id,
          to_user_id: selectedUser.id,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] mx-4 flex overflow-hidden">
        {/* Users List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No users found</p>
                {!isAdmin && (
                  <p className="text-sm text-gray-400 mt-2">
                    You can only message admin users for support
                  </p>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <li key={user.id}>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors flex items-center space-x-3 ${selectedUser?.id === user.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                        }`}
                    >
                      <div className="flex-shrink-0">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.full_name || 'User'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-full ${user.is_admin ? 'bg-yellow-600' : 'bg-primary'} flex items-center justify-center text-white font-bold`}>
                            {user.full_name?.charAt(0) || user.email.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate flex items-center">
                          {user.full_name || 'No name'}
                          {user.is_admin && (
                            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                              Admin
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200 flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {selectedUser.avatar_url ? (
                    <img
                      src={selectedUser.avatar_url}
                      alt={selectedUser.full_name || 'User'}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {selectedUser.full_name?.charAt(0) || selectedUser.email.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedUser.full_name || 'No name'}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.from_user_id === currentUser?.id ? 'justify-end' : 'justify-start'
                          }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.from_user_id === currentUser?.id
                            ? 'bg-primary text-white rounded-tr-none'
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                            }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${message.from_user_id === currentUser?.id
                              ? 'text-primary-light'
                              : 'text-gray-500'
                              }`}
                          >
                            {new Date(message.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end space-x-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    rows={3}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="bg-primary text-white p-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-xl font-medium mb-2">Select a user to start messaging</p>
              <p className="text-sm">Choose from the list on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingModal;