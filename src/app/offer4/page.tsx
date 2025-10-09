'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function Offer4Content() {
    const [queryParams, setQueryParams] = useState<Record<string, string>>({});
    const searchParams = useSearchParams();

    useEffect(() => {
        // Capture all query parameters
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            params[key] = value;
        });
        setQueryParams(params);

        // Track that this offer was viewed
        console.log('Offer 4 viewed - Current rotation index:', localStorage.getItem('redirector_rotation_index'));
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-orange-600">4</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Offer Page 4</h1>
                    <p className="text-gray-600">Welcome to the fourth offer page!</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Premium Deal #4</h3>
                    <p className="text-gray-600 mb-4">Extended warranty with lifetime support included!</p>
                    <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                        Premium Deal
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
                    Close this tab and return to the home page to continue
                </p>
            </div>
        </div>
    );
}

export default function Offer4Page() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Offer4Content />
        </Suspense>
    );
}