import React from 'react';
import { FileText, User } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useOrganizationStore } from '../store/organization';
import { cn } from '../lib/utils';

function Header() {
  const { user, logout } = useAuthStore();
  const { logo, theme } = useOrganizationStore((state) => state.settings);

  return (
    <header
      className={cn(
        'h-16 shadow-sm flex items-center justify-between px-6 transition-colors duration-200',
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      )}
    >
      <div className="flex items-center space-x-2">
        {logo ? (
          <img src={logo} alt="Company Logo" className="h-8 w-auto" />
        ) : (
          <FileText className="h-8 w-8 text-primary" />
        )}
        <span
          className={cn(
            'text-xl font-bold',
            theme === 'light' ? 'text-gray-900' : 'text-white'
          )}
        >
          CraftCV
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div
          className={cn(
            'flex items-center space-x-2',
            theme === 'light' ? 'text-gray-700' : 'text-gray-200'
          )}
        >
          <User className="h-5 w-5" />
          <span>{user?.username}</span>
        </div>
        <button
          onClick={logout}
          className={cn(
            'px-4 py-2 text-sm font-medium',
            theme === 'light'
              ? 'text-gray-700 hover:text-gray-900'
              : 'text-gray-300 hover:text-white'
          )}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;