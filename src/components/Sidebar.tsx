import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Thermometer, Activity, Moon, Sun , BarChart} from 'lucide-react';

interface SidebarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Sidebar({ darkMode, toggleDarkMode }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Health Monitoring System</h1>
        </div>
        
        <nav className="flex-1 p-4">

        <NavLink
            to="/charts"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg mb-2 ${
                isActive
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <BarChart className="mr-3" />
           Chart
          </NavLink>

          <NavLink
            to="/ecg"
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


         

        </nav>

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
  );
}