import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Chatbot from './Chatbot';
import { useApp } from '../contexts/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state } = useApp();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        state.sidebarOpen ? 'ml-0' : 'ml-0'
      }`}>
        <Header />
        
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      
      <Chatbot />
    </div>
  );
};

export default Layout;
