'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEYS = {
  ROTATION_INDEX: 'redirector_rotation_index',
  QUERY_PARAMS: 'redirector_query_params',
  IS_OPENING: 'redirector_is_opening'
};

const CONFIG = {
  OFFERS: [
    '/offer1',
    '/offer2', 
    '/offer3',
    '/offer4',
    '/offer5',
  ],
  FINAL_REDIRECT_URL: '/blankPage',
};

export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(0);
  const [totalOffers] = useState(CONFIG.OFFERS.length);
  const [campaignComplete, setCampaignComplete] = useState(false);

  useEffect(() => {
    // Check current progress
    const rotationIndex = parseInt(localStorage.getItem(STORAGE_KEYS.ROTATION_INDEX) || '0', 10);
    setCurrentOffer(rotationIndex);
    setCampaignComplete(rotationIndex >= CONFIG.OFFERS.length);

    // Show popup after a short delay, then auto-start campaign
    const popupTimer = setTimeout(() => {
      setShowPopup(true);
      
      // Auto-start campaign after showing popup (only on first load)
      if (rotationIndex === 0) {
        setTimeout(() => {
          handleStartCampaign();
        }, 1500);
      }
    }, 1000);

    // Listen for focus events (when user returns to this tab)
    const handleFocus = () => {
      // Clear the opening flag when user returns
      localStorage.removeItem(STORAGE_KEYS.IS_OPENING);
      
      // Update progress
      const newRotationIndex = parseInt(localStorage.getItem(STORAGE_KEYS.ROTATION_INDEX) || '0', 10);
      setCurrentOffer(newRotationIndex);
      setCampaignComplete(newRotationIndex >= CONFIG.OFFERS.length);

      // Auto-open next offer after a short delay (giving user time to see the progress)
      setTimeout(() => {
        // Check if there are more offers to show
        if (newRotationIndex < CONFIG.OFFERS.length && newRotationIndex > 0) {
          // Show popup to trigger next offer
          setShowPopup(true);
          
          // Auto-open next offer without user interaction
          setTimeout(() => {
            handleStartCampaign();
          }, 1000); // Wait 1 second to show progress, then auto-open
        } else if (newRotationIndex >= CONFIG.OFFERS.length) {
          // Campaign complete, show popup
          setShowPopup(true);
        }
      }, 500);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(popupTimer);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleStartCampaign = () => {
    // Check if already opening to prevent multiple tabs
    const isOpening = localStorage.getItem(STORAGE_KEYS.IS_OPENING);
    if (isOpening === 'true') {
      console.log('Already opening an offer, please wait...');
      return;
    }

    // Get current progress
    const rotationIndex = parseInt(localStorage.getItem(STORAGE_KEYS.ROTATION_INDEX) || '0', 10);
    
    // Check if campaign is complete
    if (rotationIndex >= CONFIG.OFFERS.length) {
      // Reset and go to final URL
      localStorage.removeItem(STORAGE_KEYS.ROTATION_INDEX);
      localStorage.removeItem(STORAGE_KEYS.QUERY_PARAMS);
      window.open(CONFIG.FINAL_REDIRECT_URL, '_blank');
      setCampaignComplete(true);
      return;
    }

    // Set opening flag
    localStorage.setItem(STORAGE_KEYS.IS_OPENING, 'true');

    // Get or create query params
    let queryParams = localStorage.getItem(STORAGE_KEYS.QUERY_PARAMS);
    if (!queryParams) {
      // First time - set default params
      const defaultParams = { utm_source: 'home', test: 'true' };
      localStorage.setItem(STORAGE_KEYS.QUERY_PARAMS, JSON.stringify(defaultParams));
      queryParams = JSON.stringify(defaultParams);
    }

    // Build URL with query params
    const params = JSON.parse(queryParams);
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const offerUrl = CONFIG.OFFERS[rotationIndex] + (queryString ? '?' + queryString : '');
    
    // Increment rotation index
    localStorage.setItem(STORAGE_KEYS.ROTATION_INDEX, (rotationIndex + 1).toString());
    setCurrentOffer(rotationIndex + 1);

    // Open in new tab
    window.open(offerUrl, '_blank');

    // Clear opening flag after a short delay
    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEYS.IS_OPENING);
    }, 2000);

    // Close popup
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome Home</h1>
        <p className="text-gray-600 mb-8">
          Configure your redirect cycle with any number of pages!
        </p>

        {/* Progress Tracker */}
        {currentOffer > 0 && !campaignComplete && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Campaign Progress</h3>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="text-3xl font-bold text-blue-600">{currentOffer}</div>
              <div className="text-gray-400 text-2xl">/</div>
              <div className="text-2xl text-gray-600">{totalOffers}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentOffer / totalOffers) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {totalOffers - currentOffer} offer{totalOffers - currentOffer !== 1 ? 's' : ''} remaining
            </p>
          </div>
        )}

        {campaignComplete && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">Campaign Complete!</h3>
            <p className="text-sm text-gray-600">
              You&apos;ve viewed all {totalOffers} offers. Click the popup to finish.
            </p>
          </div>
        )}
      </div>

      {/* Ad Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all animate-scaleIn">
            {/* Close button */}
            <button
              onClick={handleStartCampaign}
              className="absolute top-3 right-3 text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
              aria-label="Close"
            >
              ×
            </button>

            {/* Ad Content */}
            <div 
              onClick={handleStartCampaign}
              className="cursor-pointer"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-extrabold text-white mb-4 drop-shadow-lg">
                  SPECIAL OFFER!
                </h2>
                <p className="text-xl text-white mb-6 font-semibold drop-shadow">
                  You&apos;ve been selected for an exclusive deal!
                </p>
                <div className="bg-black bg-opacity-20 backdrop-blur-sm rounded-lg p-4 mb-6">
                  <p className="text-white text-lg font-bold">
                    {campaignComplete ? 
                      '🎁 Claim your final reward!' : 
                      currentOffer > 0 ? 
                        `🔥 Offer ${currentOffer + 1}/${totalOffers} is ready!` :
                        'Click anywhere to claim your offer! 🎁'
                    }
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-white text-sm">
                  <span className="animate-pulse">⏰</span>
                  <span className="font-semibold">Limited time only!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}