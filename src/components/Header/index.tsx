import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useCoin } from '../../context/CoinContext';
import Logo from '../Logo';
import DesktopNavigation from './DesktopNavigation';
import MobileNavigation from './MobileNavigation';
import AuthModal from './AuthModal';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(new Set());
  const location = useLocation();
  const { coins } = useCoin();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  // Check if we're on the buy-coins page to adjust header styling
  const isBuyCoinsPage = location.pathname === '/buy-coins';

  const handleBuyCoinsClick = () => {
    if (location.pathname === '/buy-coins') {
      // If we're on buy-coins page, go back to where we came from
      const previousPath = sessionStorage.getItem('previousPath') || '/';
      navigate(previousPath);
    } else {
      // Store current path and navigate to buy-coins
      sessionStorage.setItem('previousPath', location.pathname);
      navigate('/buy-coins');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close profile menu if clicked outside
      if (showProfileMenu && profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      
      // Close notifications if clicked outside
      if (showNotifications && notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu, showNotifications]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchNotifications(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchNotifications(session.user.id);
      } else {
        setProfile(null);
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if current user is admin
  const isAdmin = profile?.is_admin;
  
  // If admin, redirect from buy-coins page
  useEffect(() => {
    if (isAdmin && location.pathname === '/buy-coins') {
      navigate('/admin');
    }
  }, [isAdmin, location.pathname, navigate]);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      // Get the current user's email
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email;

      if (!userEmail) {
        console.error('User email not found');
        return;
      }

      // If no profile exists, create one
      if (!data) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            id: userId,
            email: userEmail, // Use the verified user email
            avatar_style: 'initials',
            avatar_option: 1,
            is_admin: false
          }])
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return;
        }

        setProfile(newProfile);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error in profile management:', err);
    }
  };

  const fetchNotifications = async (userId) => {
    try {
      // Load read notification IDs from localStorage
      const storedReadIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      setReadNotificationIds(new Set(storedReadIds));
      
      // Get user profile to check if admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

      let notifications = [];

      if (profile?.is_admin) {
        // Admin notifications: new submissions, campaign milestones, messages
        const [submissionsData, messagesData, campaignsData] = await Promise.all([
          // New pending submissions
          supabase
            .from('submissions')
            .select('id, idea_name, created_at, profile:profiles!user_id(full_name, email)')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(10),
          
          // Messages to admin
          supabase
            .from('messages')
            .select('id, content, created_at, read, from_user_id, profile:profiles!from_user_id(full_name, email)')
            .eq('to_user_id', userId)
            .eq('read', false)
            .order('created_at', { ascending: false })
            .limit(10),
          
          // Campaigns that hit their goal - using RPC function instead of filter
          supabase
            .rpc('get_campaigns_reaching_goal')
        ]);

        // Format admin notifications
        if (submissionsData.data) {
          notifications.push(...submissionsData.data.map(sub => ({
            id: `submission-${sub.id}`,
            type: 'submission',
            title: 'New Submission',
            message: `${sub.profile?.full_name || 'Anonymous'} submitted "${sub.idea_name}"`,
            time: sub.created_at,
            link: `/submission/${sub.id}`
          })));
        }

        if (messagesData.data) {
          notifications.push(...messagesData.data.map(msg => ({
            id: `message-${msg.id}`,
            type: 'message',
            title: 'New Message',
            message: `${msg.profile?.full_name || 'User'}: ${msg.content.substring(0, 50)}...`,
            time: msg.created_at,
            link: '/admin'
          })));
        }

        if (campaignsData.data) {
          // Ensure we have a valid array to iterate over
          const campaignsToProcess = Array.isArray(campaignsData.data) ? campaignsData.data : (campaignsData.data ? [campaignsData.data] : []);
          if (campaignsToProcess.length > 0) {
            notifications.push(...Array.from(campaignsToProcess).map(campaign => ({
              id: `campaign-${campaign.id}`,
              type: 'campaign',
              title: 'Campaign Goal Reached!',
              message: `${campaign.title} reached ${campaign.current_reservations} supporters`,
              time: new Date().toISOString(),
              link: `/campaign/${campaign.id}`
            })));
          }
        }
      } else {
        // Regular user notifications: messages, submission updates
        const [messagesData, updatesData] = await Promise.all([
          // Messages to user
          supabase
            .from('messages')
            .select('id, content, created_at, read, from_user_id, profile:profiles!from_user_id(full_name, email)')
            .eq('to_user_id', userId)
            .eq('read', false)
            .order('created_at', { ascending: false })
            .limit(10),
          
          // Submission updates
          supabase
            .from('submission_updates')
            .select(`
              id, status, comment, created_at,
              submission:submissions!submission_id(id, idea_name)
            `)
            .in('submission_id', 
              supabase
                .from('submissions')
                .select('id')
                .eq('user_id', userId)
            )
            .order('created_at', { ascending: false })
            .limit(10)
        ]);

        // Format user notifications
        if (messagesData.data) {
          notifications.push(...messagesData.data.map(msg => ({
            id: `message-${msg.id}`,
            type: 'message',
            title: 'New Message',
            message: `${msg.profile?.full_name || 'Admin'}: ${msg.content.substring(0, 50)}...`,
            time: msg.created_at,
            link: '/help'
          })));
        }

        if (updatesData.data) {
          notifications.push(...updatesData.data.map(update => ({
            id: `update-${update.id}`,
            type: 'update',
            title: 'Submission Update',
            message: `Your submission "${update.submission?.idea_name}" status: ${update.status}`,
            time: update.created_at,
            link: `/treasure-hoard`
          })));
        }
      }
      
      // Filter out notifications that have been read
      notifications = notifications.filter(notification => 
        !storedReadIds.includes(notification.id)
      );

      // Sort by time and set notifications
      notifications.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setNotifications(notifications);
      setUnreadCount(notifications.length);

    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    // Remove notification from local state
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    // Add to read notifications set to prevent showing again on refresh
    setReadNotificationIds(prev => new Set(prev).add(notificationId));
    
    // Store read notifications in localStorage
    const storedIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    localStorage.setItem('readNotifications', JSON.stringify([...storedIds, notificationId]));
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      // Mark all messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('to_user_id', user.id)
        .eq('read', false);
      
      setNotifications([]);
      setUnreadCount(0);
      
      // Add all notification IDs to read set
      const newReadIds = new Set(readNotificationIds);
      notifications.forEach(n => newReadIds.add(n.id));
      setReadNotificationIds(newReadIds);
      
      // Update localStorage
      const storedIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      const allIds = [...storedIds, ...notifications.map(n => n.id)];
      localStorage.setItem('readNotifications', JSON.stringify(allIds));
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'submission':
        return '📝';
      case 'message':
        return '💬';
      case 'campaign':
        return '🎯';
      case 'update':
        return '📋';
      default:
        return '🔔';
    }
  };

  const handleAuth = async () => {
    if (user) {
      setShowProfileMenu(!showProfileMenu);
    } else if (!showAuthModal) {
      setShowAuthModal(true);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/');
      setShowProfileMenu(false);
    } else {
      console.error('Error signing out:', error);
      setError(error.message);
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Desktop navigation */}
          <DesktopNavigation
            profileMenuRef={profileMenuRef}
            notificationsRef={notificationsRef}
            isAdmin={isAdmin}
            user={user}
            coins={coins}
            location={location}
            isBuyCoinsPage={isBuyCoinsPage}
            handleBuyCoinsClick={handleBuyCoinsClick}
            showAuthModal={showAuthModal}
            setShowAuthModal={setShowAuthModal}
            unreadCount={unreadCount}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            notifications={notifications}
            markNotificationAsRead={markNotificationAsRead}
            markAllAsRead={markAllAsRead}
            getNotificationIcon={getNotificationIcon}
            navigate={navigate}
            profile={profile}
            handleAuth={handleAuth}
            showProfileMenu={showProfileMenu}
            setShowProfileMenu={setShowProfileMenu}
            handleSignOut={handleSignOut}
          />

          {/* Mobile menu button */}
          <MobileNavigation
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isAdmin={isAdmin}
            user={user}
            coins={coins}
            isBuyCoinsPage={isBuyCoinsPage}
            handleBuyCoinsClick={handleBuyCoinsClick}
            showAuthModal={showAuthModal}
            setShowAuthModal={setShowAuthModal}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            unreadCount={unreadCount}
            location={location}
            navigate={navigate}
            handleSignOut={handleSignOut}
          />
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
      />
    </header>
  );
};

export default Header;