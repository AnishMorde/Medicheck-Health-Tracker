import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Logout from './Logout';
import { Heart, Thermometer, Activity, Moon, Sun, BarChart, Menu, X  , HomeIcon} from 'lucide-react';
import UserProfile from './UserProfile';

interface SidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Sidebar({ darkMode, toggleDarkMode }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change
  const closeSidebar = () => setIsOpen(false);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOpen]);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 z-50 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-50`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 text-center dark:text-white">
             MediCheck Health Tracker
            </h1>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 rounded-lg text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <UserProfile/>
            <NavLink
              to="/home"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg mb-2 ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <HomeIcon className="mr-3" />
              Home
            </NavLink>


            <NavLink
              to="/charts"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg mb-2 ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <BarChart className="mr-3" />
              Overall Analysis
            </NavLink>

            <NavLink
              to="/ecg"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg mb-2 ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <Heart className="mr-3" />
              ECG Monitor
            </NavLink>

            <NavLink
              to="/spo2"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg mb-2 ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <Activity className="mr-3" />
              SpO2 Monitor
            </NavLink>

            <NavLink
              to="/temperature"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg mb-2 ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <Thermometer className="mr-3" />
              Temperature
            </NavLink>

            
            <Logout />

            
          </nav>

          {/* Dark Mode Toggle */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-full p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun className="mr-2" /> : <Moon className="mr-2" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}