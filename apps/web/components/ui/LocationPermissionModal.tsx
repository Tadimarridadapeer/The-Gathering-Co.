'use client';

import React, { useState } from 'react';
import { useLocation } from '@/lib/location-context';
import { MapPin, Navigation, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { SERVICE_LOCATIONS } from '@/lib/available-locations';

export const LocationPermissionModal: React.FC = () => {
  const {
    location,
    isDetecting,
    error,
    showPromptModal,
    requestCurrentLocation,
    setCityManually,
    dismissPrompt,
  } = useLocation();

  const [showManualSelection, setShowManualSelection] = useState(false);

  if (!showPromptModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-100 overflow-hidden transform transition-all">
        {/* Decorative ambient gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={dismissPrompt}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>

        {!showManualSelection ? (
          <div className="text-center space-y-5 pt-2">
            {/* Animated Pin Icon */}
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm">
              <span className="absolute inset-0 rounded-2xl bg-rose-400 opacity-20 animate-ping" />
              <Navigation className="w-8 h-8 text-rose-600 transform -rotate-45" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-2xl text-zinc-950">
                Discover Vendors Near You
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm mx-auto">
                Allow <strong className="text-zinc-900">The Gathering Co.</strong> to access your current location to explore verified convention halls, caterers, decorators, and photographers in your city.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Current Selected Preview */}
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
              <span className="font-medium">Current default:</span>
              <span className="font-bold text-zinc-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                {location.city}, {location.state}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                disabled={isDetecting}
                onClick={async () => {
                  await requestCurrentLocation();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-70"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                    <span>Requesting Browser Location...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 text-rose-400 transform -rotate-45" />
                    <span>Use My Current Location</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isDetecting}
                onClick={() => setShowManualSelection(true)}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 font-semibold text-xs transition-colors cursor-pointer"
              >
                Choose City Manually
              </button>
            </div>

            <p className="text-[11px] text-zinc-400">
              Your browser will prompt for permission. We only use your location to customize vendor recommendations.
            </p>
          </div>
        ) : (
          /* Manual Selection View */
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-xl text-zinc-950">
                Select Your City
              </h3>
              <p className="text-xs text-zinc-500">
                Choose from available cities across Andhra Pradesh & Karnataka
              </p>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {SERVICE_LOCATIONS.map((c) => {
                const isCurrent = location.city.toLowerCase() === c.city.toLowerCase();
                const isActive = c.status === 'ACTIVE';

                return (
                  <button
                    key={c.city}
                    onClick={() => {
                      setCityManually(c.city, c.state);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-left transition-all ${
                      isCurrent
                        ? 'bg-rose-50 text-rose-900 border border-rose-200'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border border-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin
                        className={`w-4 h-4 ${isCurrent ? 'text-rose-600' : isActive ? 'text-emerald-600' : 'text-zinc-400'}`}
                      />
                      <span>{c.city}</span>
                      <span className="text-[10px] text-zinc-400 font-normal">({c.state})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'
                        }`}
                      >
                        {isActive ? 'Live' : 'Expanding'}
                      </span>
                      {isCurrent && <Check className="w-4 h-4 text-rose-600" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setShowManualSelection(false)}
                className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                &larr; Back to GPS prompt
              </button>
              <button
                onClick={dismissPrompt}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
