'use client';

import { useState, useEffect } from 'react';
import { checkBackendHealth } from '@/utils/api';

export default function BackendHealthCheck() {
  const [healthStatus, setHealthStatus] = useState<{
    isRunning: boolean;
    responseTime?: number;
    error?: string;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    const status = await checkBackendHealth();
    setHealthStatus(status);
    setIsChecking(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-3 text-black">Backend Status</h3>
      
      {isChecking ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Checking backend status...</span>
        </div>
      ) : healthStatus ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${healthStatus.isRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`font-medium ${healthStatus.isRunning ? 'text-green-700' : 'text-red-700'}`}>
              {healthStatus.isRunning ? 'Backend is running' : 'Backend is not available'}
            </span>
          </div>
          
          {healthStatus.responseTime && (
            <div className="text-sm text-gray-600">
              Response time: {healthStatus.responseTime}ms
            </div>
          )}
          
          {healthStatus.error && (
            <div className="text-sm text-red-600">
              Error: {healthStatus.error}
            </div>
          )}
          
          <button
            onClick={checkHealth}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Check Again
          </button>
        </div>
      ) : (
        <div className="text-gray-600">Loading...</div>
      )}
    </div>
  );
} 