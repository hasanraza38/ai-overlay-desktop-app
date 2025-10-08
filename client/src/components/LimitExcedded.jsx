import React, { useState, useEffect } from 'react';

const LimitExceededPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [limitData, setLimitData] = useState({
    current: 0,
    max: 100,
    type: 'API Requests',
    timeFrame: 'per hour'
  });

  // Simulate exceeding the limit
  const simulateLimitExceeded = () => {
    setLimitData({
      current: 125,
      max: 100,
      type: 'API Requests',
      timeFrame: 'per hour'
    });
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleUpgrade = () => {
    alert('Redirecting to upgrade page...');
    setShowPopup(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showPopup) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showPopup]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Current usage: {limitData.current}/{limitData.max} {limitData.type}
        </p>
        
        <button
          onClick={simulateLimitExceeded}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Simulate Limit Exceeded
        </button>

        <div className="mt-8 text-sm text-gray-500">
          <p>Click the button above to trigger the limit exceeded popup</p>
        </div>
      </div>

      {/* Popup Overlay */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-red-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Limit Exceeded
              </h2>
              <p className="text-gray-600 text-center mt-2">
                You've reached your {limitData.type} limit {limitData.timeFrame}
              </p>
            </div>

            {/* Limit Details */}
            <div className="p-6 bg-red-50 border-l-4 border-red-400 mx-6 my-4 rounded-r-lg">
              <h3 className="font-semibold text-red-700 mb-2">Usage Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {limitData.current}
                  </div>
                  <div className="text-red-500">Current Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">
                    {limitData.max}
                  </div>
                  <div className="text-gray-600">Allowed Limit</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>0</span>
                  <span>Usage Progress</span>
                  <span>{limitData.max}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min((limitData.current / limitData.max) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="px-6 pb-2">
              <p className="text-gray-600 text-sm text-center">
                Your current plan allows up to {limitData.max} {limitData.type.toLowerCase()} {limitData.timeFrame}. 
                Please upgrade your plan to continue using the service without interruptions.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="p-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              >
                Continue Anyway
              </button>
              <button
                onClick={handleUpgrade}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LimitExceededPopup;