import React from 'react';

interface DashboardCardProps {
  title: string;
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
}

export default function DashboardCard({ title, value, unit, status }: DashboardCardProps) {
  const statusColors = {
    normal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      <div className="flex items-end space-x-2">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">
          {parseFloat(value.toFixed(1))}
        </span>
        <span className="text-lg text-gray-600 dark:text-gray-400 mb-1">{unit}</span>
      </div>
      <div className={`mt-4 inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    </div>
  );
}
