import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ECGMonitor from './pages/ECGMonitor';
import SpO2Monitor from './pages/SpO2Monitor';
import TemperatureMonitor from './pages/TemperatureMonitor';
import CircularCharts from './pages/CircularChart';

function App() {
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
    <BrowserRouter>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors`}>
        {/* Sidebar Component with dark mode toggle */}
        <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        {/* Main content area */}
        <div className="ml-64">
          <Routes>
            {/* Default route redirects to ECGMonitor */}
            <Route path="/" element={<Navigate to="/ecg" replace />} />
            <Route path="/ecg" element={<ECGMonitor />} />
            <Route path="/spo2" element={<SpO2Monitor />} />
            <Route path="/temperature" element={<TemperatureMonitor />} />
            <Route path="/charts" element={<CircularCharts />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
