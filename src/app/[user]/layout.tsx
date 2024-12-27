'use client';
import React from 'react';
import Sidebar from '@/components/main/Sidebar';
import Header from '@/components/main/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Children Content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-auto bg-[#f5f5f5ff]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
