'use client';

import React from 'react';
import Link from 'next/link';
import { useLocation } from '@/lib/location-context';
import { EventBuilderForm } from '@/components/ui/EventBuilderForm';
import { SERVICE_LOCATIONS } from '@/lib/available-locations';
import { MapPin, Sparkles, ShieldCheck, Star, Navigation, Compass, ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { location, setCityManually, requestCurrentLocation, isDetecting } = useLocation();
  const currentCity = location.city || 'Anantapur';
  const isAnantapur = currentCity.toLowerCase() === 'anantapur';
  const isKadapa = currentCity.toLowerCase() === 'kadapa';
  const isActiveHub = isAnantapur || isKadapa;

  return (
    <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      {/* Editorial Luxury Ambient Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-50/60 via-amber-50/20 to-transparent pointer-events-none rounded-b-[4rem] -z-10" />
      <div className="absolute top-12 left-1/4 w-72 h-72 rounded-full bg-rose-200/20 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full bg-amber-200/20 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6 mb-12">
          
          {/* Dynamic Location Availability Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2">
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all ${
                isActiveHub
                  ? 'bg-white border border-rose-200 text-rose-900 shadow-sm'
                  : 'bg-amber-50 border border-amber-200 text-amber-900'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isActiveHub ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isActiveHub ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>

              <span className="font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                {currentCity}
                {location.isGPS && (
                  <span className="text-[10px] text-zinc-500 font-normal">(GPS detected)</span>
                )}
              </span>

              <span className="text-zinc-300">&bull;</span>

              <span>
                {isKadapa
                  ? '34+ Verified Local Vendors Live in Kadapa'
                  : isAnantapur
                  ? '34+ Verified Local Vendors Live in Anantapur'
                  : "We're Spreading Our Team Locally Here"}
              </span>
            </div>

            <button
              type="button"
              disabled={isDetecting}
              onClick={async () => {
                await requestCurrentLocation();
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Detect your current location via GPS"
            >
              <Navigation className={`w-3 h-3 text-rose-600 ${isDetecting ? 'animate-spin' : ''}`} />
              <span>{isDetecting ? 'Detecting...' : 'Use GPS'}</span>
            </button>
          </div>

          {/* Luxury Editorial Headline in Newsreader 36pt */}
          <h1 className="font-newsreader-36pt text-4xl sm:text-6xl lg:text-7xl font-normal text-zinc-950 tracking-[-0.03em] leading-[1.06] select-none">
            Every memorable event begins with{' '}
            <span className="italic font-serif underline decoration-rose-300 decoration-wavy decoration-1 underline-offset-8">
              The Gathering Co.
            </span>
          </h1>

          {/* Dynamic Editorial Subtitle */}
          <p className="text-base sm:text-xl text-zinc-600 font-normal max-w-2xl mx-auto leading-relaxed">
            {isActiveHub ? (
              <>
                {currentCity}&apos;s curated marketplace for weddings and celebrations. Discover, compare, shortlist, and book 100% verified function halls, feast caterers, and decorators with direct quotes.
              </>
            ) : (
              <>
                Curating celebrations in <strong className="text-zinc-900 font-semibold">{currentCity}</strong> and across Rayalaseema. Book inspected local venues or traveling verified teams with zero markup.
              </>
            )}
          </p>

          {/* Quick Hub Switcher Bar */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-zinc-400 font-medium">Browse hubs:</span>
            {SERVICE_LOCATIONS.map((loc) => {
              const isSelected = currentCity.toLowerCase() === loc.city.toLowerCase();
              const isLive = loc.status === 'ACTIVE';

              return (
                <button
                  key={loc.city}
                  onClick={() => setCityManually(loc.city, loc.state)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-950 text-white shadow-sm'
                      : isLive
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-zinc-100/80 hover:bg-zinc-200 text-zinc-600'
                  }`}
                >
                  <span>{loc.city}</span>
                  {isLive && (
                    <span
                      className={`ml-1 text-[9px] px-1 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-zinc-800 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Live
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center justify-center gap-4 pt-3">
            <Link
              href="/my-event"
              className="px-6 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 group"
            >
              <span>Build Custom Event</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href={`/vendors?city=${encodeURIComponent(currentCity)}`}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 font-bold text-xs transition-colors shadow-xs"
            >
              Explore {currentCity} Vendors
            </Link>
          </div>

          {/* Social Proof Trust Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% In-Person Verified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>4.9/5 Average Vendor Rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>Direct Managed Quotes</span>
            </div>
          </div>
        </div>

        {/* Interactive Event Builder Workspace Form */}
        <div className="max-w-4xl mx-auto">
          <EventBuilderForm />
        </div>

      </div>
    </section>
  );
};
