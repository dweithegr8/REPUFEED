import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, MessageSquare, Settings, LogOut, Loader2, X } from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    
    if (isLoggingOut) return; // Prevent double-click
    
    setIsLoggingOut(true);
    
    try {
      // TODO: Call logout API when Laravel backend is ready
      // await authAPI.logout();
      
      // Clear any stored auth tokens
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      
      // Small delay for UX feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Navigate to login page
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if API call fails
      navigate('/admin/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-lightGray min-h-screen flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-neutral-lightGray flex items-center justify-between">
          <a href="/admin/dashboard" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary-orange rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <div>
            <span className="text-primary-dark font-bold text-lg block">RepuFeed</span>
            <span className="text-neutral-slate text-xs">Admin Portal</span>
          </div>
        </a>
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="md:hidden p-2 rounded-lg hover:bg-neutral-offWhite transition-colors"
        >
          <X className="w-5 h-5 text-neutral-slate" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-dark text-white'
                      : 'text-neutral-slate hover:bg-neutral-offWhite hover:text-primary-dark'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-neutral-lightGray">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium text-neutral-slate hover:bg-red-50 hover:text-red-600 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="w-5 h-5" />
              Logout
            </>
          )}
        </button>
      </div>
    </aside>
    </>
  );
};

export default AdminSidebar;
