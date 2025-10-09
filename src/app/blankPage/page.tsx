'use client';

import { useEffect } from 'react';

export default function BlankPage() {
  useEffect(() => {
    // Auto-redirect to external site after showing completion message
    const timer = setTimeout(() => {
      // You can change this to any external URL your client wants
      window.location.href = 'https://www.google.com';
      // Or keep it blank/close tab automatically (some browsers block this)
      // window.close();
    }, 3000); // 3 seconds to show completion message

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Campaign Complete!</h1>
          <p className="text-gray-600">Thank you for viewing all our offers!</p>
        </div>

        <div className="bg-green-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Congratulations!</h3>
          <p className="text-gray-600 mb-4">
            You&apos;ve successfully completed the entire campaign.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
            <span>Redirecting in 3 seconds...</span>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          You can close this tab now
        </p>
      </div>
    </div>
  );
}