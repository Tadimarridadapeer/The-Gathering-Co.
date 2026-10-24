'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocation } from '@/lib/location-context';
import { VendorCard } from '@/components/ui/VendorCard';
import { LocalExpansionCard } from '@/components/ui/LocalExpansionCard';
import { MapPin, Sparkles, Compass } from 'lucide-react';
import { SERVICE_LOCATIONS } from '@/lib/available-locations';
import { getVendorsByCity } from '@/lib/anantapur-vendors';

interface FeaturedVendorsSectionProps {
  initialVendors?: any[];
  initialCity?: string;
}

export const FeaturedVendorsSection: React.FC<FeaturedVendorsSectionProps> = ({
  initialVendors = [],
  initialCity = 'Anantapur',
}) => {
  const { location, setCityManually } = useLocation();
  const activeCity = location.city || initialCity;

  const [vendors, setVendors] = useState<any[]>(initialVendors);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function fetchVendorsForCity(city: string) {
      setLoading(true);
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL ?? (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '3000' ? 'http://localhost:4000' : '');
        const res = await fetch(`${apiBase}/api/vendors?city=${encodeURIComponent(city)}&limit=4`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setVendors(data.items || []);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // Fallback for offline or local dev
      }

      if (!isCancelled) {
        const localFallback = getVendorsByCity(city).slice(0, 4);
        if (localFallback.length > 0) {
          setVendors(localFallback);
        } else if (city.toLowerCase() === 'anantapur' && initialVendors.length > 0) {
          setVendors(initialVendors);
        } else {
          setVendors([]);
        }
        setLoading(false);
      }
    }

    fetchVendorsForCity(activeCity);

    return () => {
      isCancelled = true;
    };
  }, [activeCity, initialVendors]);

  const hasVendors = vendors && vendors.length > 0;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all">
      {/* Locations Availability Navigation Strip */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs">
        <div className="flex items-center gap-2 text-zinc-700 font-semibold">
          <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
          <span>Active & Expanding Hubs:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {SERVICE_LOCATIONS.map((loc) => {
            const isSelected = activeCity.toLowerCase() === loc.city.toLowerCase();
            const isActive = loc.status === 'ACTIVE';

            return (
              <button
                key={loc.city}
                onClick={() => setCityManually(loc.city, loc.state)}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-xs'
                    : isActive
                    ? 'bg-white hover:bg-rose-50 text-zinc-800 border border-zinc-200'
                    : 'bg-zinc-100/80 hover:bg-zinc-200/80 text-zinc-500'
                }`}
              >
                <span>{loc.city}</span>
                {isActive ? (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-rose-700 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Live
                  </span>
                ) : (
                  <span
                    className={`text-[9px] px-1 rounded-full ${
                      isSelected ? 'bg-rose-700 text-white' : 'bg-zinc-200 text-zinc-600'
                    }`}
                  >
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {hasVendors ? (
        /* VENDORS AVAILABLE IN THIS LOCATION */
        <div className="space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Verified Local Businesses in {activeCity}</span>
              </div>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-zinc-950">
                Featured Vendors in {activeCity}
              </h3>
            </div>
            <Link
              href={`/vendors?city=${encodeURIComponent(activeCity)}`}
              className="text-xs font-bold text-zinc-800 hover:text-rose-600 transition-colors self-start sm:self-auto"
            >
              Explore All {activeCity} Vendors &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vendors.map((vendor: any) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>
      ) : (
        /* NO VENDORS IN THIS LOCATION -> DISPLAY EXPANSION CARD */
        <div className="animate-fadeIn">
          <LocalExpansionCard city={activeCity} state={location.state} />
        </div>
      )}
    </section>
  );
};
