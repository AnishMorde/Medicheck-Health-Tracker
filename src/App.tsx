import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ECGMonitor from './pages/ECGMonitor';
import SpO2Monitor from './pages/SpO2Monitor';
import TemperatureMonitor from './pages/TemperatureMonitor';
import CircularCharts from './pages/CircularChart';
import HomePage from './pages/HomePage';
import Login from './components/Login';
import AuthCallback from './pages/auth/AuthCallback';
import { supabase } from './lib/supabase';
import Logout from './components/Logout';

// Protected Route component (same as before)
const ProtectedRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return user ? <AppLayout /> : <Navigate to="/" replace />;
};

// App Layout component with Sidebar (same as before)
const AppLayout = () => {
  // Manage dark mode state with fallback to localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Store dark mode preference in localStorage and update class on <html>
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Toggle dark mode between true/false
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors`}>
      {/* Sidebar Component with dark mode toggle */}
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Main content area */}
      <div className="ml-64">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Protected routes inside AppLayout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/ecg" element={<ECGMonitor />} />
          <Route path="/spo2" element={<SpO2Monitor />} />
          <Route path="/temperature" element={<TemperatureMonitor />} />
          <Route path="/charts" element={<CircularCharts />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/auth/callback" element={<AuthCallback/>} />
        </Route>
        
        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;