import React from 'react';
import { NavLink } from 'react-router-dom';
import { Upload, List, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { useOrganizationStore } from '../store/organization';

const navigation = [
  { name: 'Upload CV', path: '/upload-cv', icon: Upload },
  { name: 'CV Listing', path: '/cv-listing', icon: List },
  { name: 'Organisation Settings', path: '/settings', icon: Settings },
];

function Sidebar() {
  const theme = useOrganizationStore((state) => state.settings.theme);

  return (
    <nav
      className={cn(
        'w-64 border-r p-4 transition-colors duration-200',
        theme === 'light'
          ? 'bg-white border-gray-200'
          : 'bg-gray-800 border-gray-700'
      )}
    >
      <div className="space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium',
                isActive
                  ? 'bg-primary text-white'
                  : theme === 'light'
                  ? 'text-gray-600 hover:bg-gray-50'
                  : 'text-gray-300 hover:bg-gray-700'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default Sidebar;