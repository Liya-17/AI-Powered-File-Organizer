import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Files from './pages/Files';
import Recent from './pages/Recent';
import Starred from './pages/Starred';
import Trash from './pages/Trash';
import Shared from './pages/Shared';
import Settings from './pages/Settings';

// Page Transition Wrapper
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div 
      key={location.pathname}
      className="animate-fadeIn"
      style={{ animationDuration: '0.4s' }}
    >
      {children}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App min-h-screen">
          <Layout>
            <Routes>
              <Route path="/" element={
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              } />
              <Route path="/files" element={
                <PageTransition>
                  <Files />
                </PageTransition>
              } />
              <Route path="/recent" element={
                <PageTransition>
                  <Recent />
                </PageTransition>
              } />
              <Route path="/starred" element={
                <PageTransition>
                  <Starred />
                </PageTransition>
              } />
              <Route path="/trash" element={
                <PageTransition>
                  <Trash />
                </PageTransition>
              } />
              <Route path="/shared" element={
                <PageTransition>
                  <Shared />
                </PageTransition>
              } />
              <Route path="/settings" element={
                <PageTransition>
                  <Settings />
                </PageTransition>
              } />
            </Routes>
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
