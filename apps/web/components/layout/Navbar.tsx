'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Menu, X, ChevronDown, Crosshair, Loader2, Check } from 'lucide-react';
import { useLocation } from '@/lib/location-context';
import { SERVICE_LOCATIONS } from '@/lib/available-locations';

const VENDOR_MEGA_CATEGORIES = [
  { name: 'Venues & AC Halls', slug: 'venues' },
  { name: 'Photographers', slug: 'photographers' },
  { name: 'Videographers', slug: 'videographers' },
  { name: 'Decorators & Mandap', slug: 'decorators' },
  { name: 'Caterers & Feasts', slug: 'caterers' },
  { name: 'Makeup Artists', slug: 'makeup-artists' },
  { name: 'Mehendi Artists', slug: 'mehendi-artists' },
  { name: 'DJs & Sound Systems', slug: 'djs' },
  { name: 'Musicians & Band', slug: 'musicians' },
  { name: 'Anchors & Emcees', slug: 'anchors' },
  { name: 'Event Planners', slug: 'event-planners' },
  { name: 'Wedding Cars', slug: 'wedding-cars' },
  { name: 'Invitation Designers', slug: 'invitation-designers' },
  { name: 'Return Gifts', slug: 'return-gifts' },
  { name: 'Purohits & Pandits', slug: 'purohits' },
];

export const Navbar = () => {
  const { location, isDetecting, requestCurrentLocation, setCityManually } = useLocation();
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [vendorsDropdownOpen, setVendorsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stateAbbr = location.state === 'Andhra Pradesh' ? 'AP' : location.state === 'Karnataka' ? 'KA' : location.state === 'Telangana' ? 'TS' : location.state?.slice(0, 2).toUpperCase() || 'AP';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & City Selector */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="flex flex-col font-newsreader-36pt text-zinc-950 leading-[0.9] tracking-[-0.02em] select-none">
                <span className="text-[14px] sm:text-[15px] font-normal tracking-tight">The</span>
                <span className="text-[22px] sm:text-[26px] font-normal tracking-tight">Gathering Co.</span>
              </div>
              <span className="h-6 w-[1px] bg-zinc-200 hidden sm:inline-block"></span>
              <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-medium hidden sm:inline-block">
                {location.city} &bull; {stateAbbr}
              </span>
            </Link>

            {/* City Location Picker */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200/80 text-zinc-900 text-xs font-semibold transition-all border border-zinc-200/60 shadow-sm"
              >
                <div className="relative flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  {location.isGPS && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                  )}
                </div>
                <span>{location.city}</span>
                <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded-full">
                  {stateAbbr}
                </span>
                <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${cityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {cityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-white shadow-2xl border border-zinc-200 p-2.5 z-50 animate-fadeIn">
                  {/* Current GPS Action Button */}
                  <button
                    type="button"
                    disabled={isDetecting}
                    onClick={async () => {
                      await requestCurrentLocation();
                      setCityDropdownOpen(false);
                    }}
                    className="w-full mb-3 p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200/80 flex items-center justify-between text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-sm">
                        {isDetecting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Crosshair className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-rose-950">
                          {isDetecting ? 'Detecting GPS...' : 'Use Current Location'}
                        </div>
                        <div className="text-[10px] text-rose-700/80">
                          {location.isGPS ? `GPS Active (${location.city})` : 'Detect city automatically'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded-full">
                      GPS
                    </span>
                  </button>

                  <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Locations & Hubs</span>
                    {location.isGPS && (
                      <span className="text-emerald-600 text-[10px] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Live GPS
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {SERVICE_LOCATIONS.map((city) => {
                      const isCurrent = location.city.toLowerCase() === city.city.toLowerCase();
                      const isActive = city.status === 'ACTIVE';

                      return (
                        <button
                          key={city.city}
                          onClick={() => {
                            setCityManually(city.city, city.state);
                            setCityDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                            isCurrent
                              ? 'bg-rose-50/80 text-rose-900 font-bold'
                              : 'hover:bg-zinc-100 text-zinc-800 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className={`w-3.5 h-3.5 ${isCurrent ? 'text-rose-600' : isActive ? 'text-emerald-600' : 'text-zinc-400'}`} />
                            <span>{city.city}</span>
                            <span className="text-[10px] text-zinc-400 font-normal">({city.state})</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                                isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-500'
                              }`}
                            >
                              {isActive ? 'Live' : 'Expanding'}
                            </span>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-rose-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav Links with Vendors Mega Dropdown */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-zinc-800">
            <Link href="/" className="hover:text-rose-600 transition-colors">
              Discover
            </Link>
            <Link href="/my-event" className="hover:text-rose-600 transition-colors">
              Plan My Event
            </Link>

            {/* Vendors Hover / Click Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setVendorsDropdownOpen(true)}
              onMouseLeave={() => setVendorsDropdownOpen(false)}
            >
              <button
                onClick={() => setVendorsDropdownOpen(!vendorsDropdownOpen)}
                className="flex items-center gap-1 hover:text-rose-600 transition-colors py-2"
              >
                <span>Vendors</span>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${vendorsDropdownOpen ? 'rotate-180 text-rose-600' : ''}`} />
              </button>

              {/* Mega Dropdown Menu */}
              {vendorsDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[560px] rounded-3xl bg-white shadow-2xl border border-zinc-200 p-6 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      Anantapur Event Categories
                    </span>
                    <Link
                      href="/vendors"
                      onClick={() => setVendorsDropdownOpen(false)}
                      className="text-[11px] font-bold text-zinc-900 hover:text-rose-600 underline"
                    >
                      View All Vendors
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                    {VENDOR_MEGA_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/vendors?category=${cat.slug}`}
                        onClick={() => setVendorsDropdownOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-zinc-800 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-zinc-400 font-normal">Anantapur</span>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium">Looking for specific services?</span>
                    <Link
                      href="/vendors"
                      onClick={() => setVendorsDropdownOpen(false)}
                      className="px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold text-[11px] shadow-sm hover:bg-zinc-800 transition-colors"
                    >
                      Browse Marketplace
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/inspiration" className="hover:text-rose-600 transition-colors">
              Inspiration
            </Link>
          </nav>

          {/* Start Planning CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/my-event"
              className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              Start Planning
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-800 hover:bg-zinc-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 px-4 pt-4 pb-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <span className="text-xs text-zinc-500 font-medium">Location:</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                {location.city}, {stateAbbr}
              </span>
              <button
                type="button"
                disabled={isDetecting}
                onClick={async () => {
                  await requestCurrentLocation();
                }}
                className="p-1 px-2 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 flex items-center gap-1"
              >
                {isDetecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crosshair className="w-3 h-3" />}
                <span>GPS</span>
              </button>
            </div>
          </div>
          <nav className="flex flex-col gap-3 text-sm font-semibold text-zinc-900">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              Discover
            </Link>
            <Link href="/my-event" onClick={() => setMobileMenuOpen(false)}>
              Plan My Event
            </Link>
            <div className="space-y-2 pt-1 border-t border-zinc-100">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
                Vendor Categories
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium text-zinc-700">
                {VENDOR_MEGA_CATEGORIES.slice(0, 8).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/vendors?category=${c.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-rose-600"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/inspiration" onClick={() => setMobileMenuOpen(false)}>
              Inspiration
            </Link>
          </nav>

          <Link
            href="/my-event"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mt-2 py-3 rounded-xl bg-zinc-950 text-white font-bold text-center block text-sm shadow-md"
          >
            Start Planning
          </Link>
        </div>
      )}
    </header>
  );
};
