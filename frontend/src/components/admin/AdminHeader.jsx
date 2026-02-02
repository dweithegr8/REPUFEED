import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, X, LogOut, Settings, ChevronDown, Menu } from 'lucide-react';

const AdminHeader = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Mock notifications - will be populated by API
  const [notifications, setNotifications] = useState([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // API call would go here
      // await authAPI.logout();
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <header className="bg-white border-b border-neutral-lightGray px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-offWhite transition-colors"
          >
            <Menu className="w-6 h-6 text-primary-dark" />
          </button>
          <div>
            <p className="text-sm text-neutral-slate">Welcome back,</p>
            <h2 className="text-lg font-semibold text-primary-dark">Administrator</h2>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-neutral-slate hover:text-primary-dark hover:bg-neutral-offWhite rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary-orange rounded-full"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-neutral-lightGray z-50">
                <div className="flex items-center justify-between p-4 border-b border-neutral-lightGray">
                  <h3 className="font-semibold text-primary-dark">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-primary-orange hover:text-primary-dark transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <Bell className="w-8 h-8 text-neutral-lightGray mx-auto mb-2" />
                      <p className="text-neutral-slate text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-3 p-4 hover:bg-neutral-offWhite border-b border-neutral-lightGray last:border-b-0"
                      >
                        <div className="flex-grow">
                          <p className="text-sm text-primary-dark">{notification.message}</p>
                          <p className="text-xs text-neutral-slate mt-1">{notification.time}</p>
                        </div>
                        <button
                          onClick={() => clearNotification(notification.id)}
                          className="p-1 text-neutral-slate hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile with Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 pl-4 border-l border-neutral-lightGray hover:bg-neutral-offWhite rounded-lg p-2 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-dark rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-primary-dark">Admin User</p>
                <p className="text-xs text-neutral-slate">admin@repufeed.com</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-neutral-slate transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-lightGray z-50">
                <div className="p-4 border-b border-neutral-lightGray">
                  <p className="font-semibold text-primary-dark">Admin User</p>
                  <p className="text-sm text-neutral-slate">admin@repufeed.com</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/admin/settings');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-slate hover:text-primary-dark hover:bg-neutral-offWhite rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" />
                        Logout
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
