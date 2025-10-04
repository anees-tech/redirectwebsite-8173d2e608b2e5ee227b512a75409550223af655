'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function Offer2Content() {
    const [queryParams, setQueryParams] = useState<Record<string, string>>({});
    const searchParams = useSearchParams();

    useEffect(() => {
        // Capture all query parameters
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });
        setQueryParams(params);
    }, [searchParams]);

    useEffect(() => {
        const handleBackButtonSetup = () => {
            // Add an entry to browser history so back button returns to redirect page
            window.history.pushState(null, '', window.location.href);

            const handlePopState = () => {
                // When back button is pressed, go to redirect page
                const queryString = new URLSearchParams(queryParams).toString();
                const redirectUrl = queryString ? `/redirect?${queryString}` : '/redirect';
                window.location.href = redirectUrl;
            };

            window.addEventListener('popstate', handlePopState);

            return () => {
                window.removeEventListener('popstate', handlePopState);
            };
        };

        const cleanup = handleBackButtonSetup();
        return cleanup;
    }, [queryParams]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-green-600">2</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Offer Page 2</h1>
                    <p className="text-gray-600">Welcome to the second offer page!</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Exclusive Deal #2</h3>
                    <p className="text-gray-600 mb-4">Buy 2 get 1 free! Amazing value for money.</p>
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Get Deal
                    </button>
                </div>

                {Object.keys(queryParams).length > 0 && (
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Tracking Parameters:</h4>
                        <div className="text-xs text-gray-600 space-y-1">
                            {Object.entries(queryParams).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                    <span className="font-mono">{key}:</span>
                                    <span className="font-mono">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <p className="text-sm text-gray-500 mt-6">
                    Press the back button to see the next offer
                </p>
            </div>
        </div>
    );
}

export default function Offer2Page() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Offer2Content />
        </Suspense>
    );
}