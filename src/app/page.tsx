'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Show popup after a short delay
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleStartCampaign = () => {
    router.push('/redirect?utm_source=home&test=true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome Home</h1>
        <p className="text-gray-600 mb-8">
          Configure your redirect cycle with any number of pages!
        </p>
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
                  You've been selected for an exclusive deal!
                </p>
                <div className="bg-black bg-opacity-20 backdrop-blur-sm rounded-lg p-4 mb-6">
                  <p className="text-white text-lg font-bold">
                    Click anywhere to claim your offer! 🎁
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