import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/files" element={<Files />} />
              <Route path="/recent" element={<Recent />} />
              <Route path="/starred" element={<Starred />} />
              <Route path="/trash" element={<Trash />} />
              <Route path="/shared" element={<Shared />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
