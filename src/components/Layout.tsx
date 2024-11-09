import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useOrganizationStore } from '../store/organization';
import { cn } from '../lib/utils';

function Layout() {
  const { primaryColor, secondaryColor, theme } = useOrganizationStore(
    (state) => state.settings
  );

  return (
    <div
      className={cn(
        'min-h-screen transition-colors duration-200',
        theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'
      )}
      style={{
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor,
      } as React.CSSProperties}
    >
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;