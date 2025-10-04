'use client';

import { useEffect } from 'react';

// CONFIGURATION - Easily modify these values
const CONFIG = {
  // Define your local offer pages here - easily scalable for N entries
  OFFERS: [
    '/offer1',
    '/offer2', 
    '/offer3',
  
    // Add more pages as needed: '/offer6', '/offer7', etc.
  ],
  // Final redirect URL when all offers are exhausted
  // FINAL_REDIRECT_URL: 'https://www.google.com',
  // Alternative options:
  FINAL_REDIRECT_URL: '/blankPage',
  // FINAL_REDIRECT_URL: 'https://www.bing.com',
  // FINAL_REDIRECT_URL: 'https://example.com',
  // FINAL_REDIRECT_URL: '/', // To redirect back to home page
};

const STORAGE_KEYS = {
  ROTATION_INDEX: 'redirector_rotation_index',
  QUERY_PARAMS: 'redirector_query_params'
};

export default function RedirectPage() {

  useEffect(() => {
    const handleRedirect = () => {
      try {
        // Get current URL and extract query parameters
        const currentUrl = new URL(window.location.href);
        const currentParams = currentUrl.searchParams;
        
        // Check if we have stored query parameters
        let storedParams = localStorage.getItem(STORAGE_KEYS.QUERY_PARAMS);
        let rotationIndex = parseInt(localStorage.getItem(STORAGE_KEYS.ROTATION_INDEX) || '0', 10);
        
        // If no stored params, this is the first visit
        if (!storedParams) {
          // Store all query parameters for future use
          const paramsObj: Record<string, string> = {};
          currentParams.forEach((value, key) => {
            paramsObj[key] = value;
          });
          
          localStorage.setItem(STORAGE_KEYS.QUERY_PARAMS, JSON.stringify(paramsObj));
          localStorage.setItem(STORAGE_KEYS.ROTATION_INDEX, '0');
          storedParams = JSON.stringify(paramsObj);
          rotationIndex = 0;
        }
        
        // Parse stored parameters
        const queryParams = JSON.parse(storedParams);
        
        // Build query string from stored parameters
        const queryString = Object.keys(queryParams)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
          .join('&');
        
        // Determine redirect URL
        let redirectUrl: string;
        
        if (rotationIndex < CONFIG.OFFERS.length) {
          // Redirect to current offer with query parameters
          redirectUrl = CONFIG.OFFERS[rotationIndex];
          if (queryString) {
            redirectUrl += (redirectUrl.includes('?') ? '&' : '?') + queryString;
          }
          
          // Increment rotation index for next visit
          localStorage.setItem(STORAGE_KEYS.ROTATION_INDEX, (rotationIndex + 1).toString());
        } else {
          // All offers exhausted, redirect to final URL and clear storage
          redirectUrl = CONFIG.FINAL_REDIRECT_URL;
          localStorage.removeItem(STORAGE_KEYS.ROTATION_INDEX);
          localStorage.removeItem(STORAGE_KEYS.QUERY_PARAMS);
        }
        
        // Perform instant redirect
        console.log(`Redirecting to: ${redirectUrl} (rotation index: ${rotationIndex})`);
        window.location.replace(redirectUrl);
        
      } catch (error) {
        console.error('Redirect error:', error);
        // Fallback redirect on error
        window.location.replace(CONFIG.FINAL_REDIRECT_URL);
      }
    };

    // Small delay to show the redirecting message briefly
    const timeoutId = setTimeout(handleRedirect, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Redirecting...</h1>
        <p className="text-gray-600">Please wait while we redirect you to your destination.</p>
      </div>
    </div>
  );
}