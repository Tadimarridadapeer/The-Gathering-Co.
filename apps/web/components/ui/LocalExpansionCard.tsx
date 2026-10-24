'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Users, Bell, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { SERVICE_LOCATIONS } from '@/lib/available-locations';
import { useLocation } from '@/lib/location-context';

interface LocalExpansionCardProps {
  city?: string;
  state?: string;
  compact?: boolean;
}

export const LocalExpansionCard: React.FC<LocalExpansionCardProps> = ({
  city,
  state,
  compact = false,
}) => {
  const { location, setCityManually } = useLocation();
  const targetCity = city || location.city || 'your area';
  const targetState = state || location.state || 'India';

  const [contactInput, setContactInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim()) return;
    setSubmitted(true);
  };

  const activeLocations = SERVICE_LOCATIONS.filter((l) => l.status === 'ACTIVE');
  const expandingLocations = SERVICE_LOCATIONS.filter((l) => l.status === 'EXPANDING');

  return (
    <div className="w-full bg-gradient-to-b from-white to-rose-50/30 rounded-3xl border border-rose-200/80 p-6 sm:p-10 shadow-lg relative overflow-hidden text-zinc-900">
      {/* Background ambient accents */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-rose-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        
        {/* Top Status Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <Compass className="w-3.5 h-3.5" />
            <span>Expanding to {targetCity}</span>
          </div>

          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-zinc-950 tracking-tight leading-snug">
            We&apos;re spreading our team to go locally in {targetCity}!
          </h2>

          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto leading-relaxed">
            The Gathering Co. strictly inspects every venue and vendor in-person before listing. Our regional field team is currently on the ground in <strong className="text-zinc-900 font-semibold">{targetCity}</strong> meeting convention hall managers, authentic caterers, and decorators to bring 100% verified event bookings to your city.
          </p>
        </div>

        {/* Available Locations Switcher Bar */}
        <div className="bg-white/90 backdrop-blur rounded-2xl border border-zinc-200/80 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-600" />
              Where We Are Currently Available:
            </span>
            <span className="text-[11px] text-zinc-500">
              Verified local vendors ready to book
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeLocations.map((loc) => (
              <button
                key={loc.city}
                onClick={() => setCityManually(loc.city, loc.state)}
                className="flex items-center justify-between p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 hover:border-rose-400 transition-all text-left group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {loc.city.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-950 group-hover:text-rose-700 transition-colors flex items-center gap-1">
                      <span>{loc.city}</span>
                      <span className="text-[10px] text-zinc-400 font-normal">({loc.state})</span>
                    </div>
                    <div className="text-[10px] font-medium text-rose-700">
                      {loc.vendorCountLabel}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-rose-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}

            {expandingLocations.slice(0, 2).map((loc) => (
              <div
                key={loc.city}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/60 text-left opacity-80"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-200 text-zinc-700 font-bold flex items-center justify-center text-xs">
                    {loc.city.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-800">
                      <span>{loc.city}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {loc.vendorCountLabel}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Expanding
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Launch Alerts & Vendor Partner CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* User Notify Form */}
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
              <Bell className="w-4 h-4" />
              <span>Get Notified on Launch</span>
            </div>
            <p className="text-xs text-zinc-600">
              Be the first to access verified venues and exclusive inaugural booking discounts in <strong className="text-zinc-900">{targetCity}</strong>.
            </p>

            {!submitted ? (
              <form onSubmit={handleNotifySubmit} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Enter phone or email..."
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Notify Me
                </button>
              </form>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>You&apos;re on the priority waitlist for {targetCity}!</span>
              </div>
            )}
          </div>

          {/* Local Vendor Onboarding */}
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-zinc-800 text-xs font-bold uppercase tracking-wider">
                <Users className="w-4 h-4 text-rose-600" />
                <span>Are You a Vendor in {targetCity}?</span>
              </div>
              <p className="text-xs text-zinc-600">
                Function hall owners, caterers, photographers & decorators in {targetCity} get verified and receive high-intent inquiries.
              </p>
            </div>
            <a
              href="mailto:partners@thegatheringco.com?subject=Vendor%20Verification%20Application"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 transition-colors w-full"
            >
              <span>Apply for Local Verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Rayalaseema Traveling Vendor Banner */}
        <div className="p-4 rounded-2xl bg-zinc-950 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-rose-500 flex-shrink-0" />
            <span className="text-zinc-300">
              Need vendors in <strong className="text-white font-bold">{targetCity}</strong> immediately? Our top verified Andhra teams travel district-wide for weddings and receptions.
            </span>
          </div>
          <Link
            href="/my-event"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold whitespace-nowrap shadow-sm transition-colors text-[11px]"
          >
            Custom Event Quote
          </Link>
        </div>

      </div>
    </div>
  );
};
