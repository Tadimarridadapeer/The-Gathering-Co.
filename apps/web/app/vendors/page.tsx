import React from 'react';
import Link from 'next/link';
import { VendorCard } from '@/components/ui/VendorCard';
import { LocalExpansionCard } from '@/components/ui/LocalExpansionCard';
import { SERVICE_LOCATIONS } from '@/lib/available-locations';
import { getVendorsByCity } from '@/lib/anantapur-vendors';
import { MapPin } from 'lucide-react';

async function getVendors(searchParams: { [key: string]: string | undefined }) {
  const city = searchParams.city || 'Anantapur';
  const category = searchParams.category || '';
  const sortBy = searchParams.sortBy || 'recommended';
  const verifiedOnly = searchParams.verifiedOnly === 'true';

  try {
    const query = new URLSearchParams({
      city,
      ...(category && { category }),
      ...(sortBy && { sortBy }),
      ...(verifiedOnly && { verifiedOnly: 'true' }),
    });

    const res = await fetch(`http://localhost:4000/api/vendors?${query.toString()}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return data.items || [];
    }
  } catch (e) {}

  const allVendors = getVendorsByCity(city);

  if (category) {
    return allVendors.filter((v) => v.categorySlug === category || v.categoryName?.toLowerCase() === category.toLowerCase());
  }
  return allVendors;
}

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const city = resolvedParams.city || 'Anantapur';
  const vendors = await getVendors(resolvedParams);
  const activeCategory = resolvedParams.category || '';

  const categories = [
    { slug: '', label: 'All Categories' },
    { slug: 'venues', label: 'Venues' },
    { slug: 'photographers', label: 'Photographers' },
    { slug: 'caterers', label: 'Caterers' },
    { slug: 'makeup-artists', label: 'Makeup Artists' },
    { slug: 'decorators', label: 'Decorators' },
    { slug: 'event-planners', label: 'Event Planners' },
    { slug: 'mehendi-artists', label: 'Mehendi' },
    { slug: 'djs', label: 'DJs & Sound' },
    { slug: 'invitation-designers', label: 'Invitations' },
    { slug: 'return-gifts', label: 'Return Gifts' },
    { slug: 'wedding-cars', label: 'Wedding Cars' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>{city} Vendor Marketplace</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-zinc-950">
          Discover Verified Event Vendors {city ? `in ${city}` : ''}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl">
          Browse verified function halls, caterers, mandap decorators, and photographers in {city}.
        </p>
      </div>

      {/* Available Locations Switcher Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs">
        <span className="font-bold text-zinc-700 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-rose-600" />
          Available Locations:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {SERVICE_LOCATIONS.map((loc) => {
            const isSelected = city.toLowerCase() === loc.city.toLowerCase();
            const isActive = loc.status === 'ACTIVE';
            return (
              <Link
                key={loc.city}
                href={`/vendors?city=${encodeURIComponent(loc.city)}${activeCategory ? `&category=${activeCategory}` : ''}`}
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-xs'
                    : isActive
                    ? 'bg-white hover:bg-rose-50 text-zinc-900 border border-zinc-200'
                    : 'bg-zinc-200/60 hover:bg-zinc-200 text-zinc-600'
                }`}
              >
                <span>{loc.city}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-rose-700 text-white' : isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  {isActive ? 'Live' : 'Expanding'}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Category Pills & Sorting Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-zinc-200">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((c) => {
            const isActive = activeCategory === c.slug;
            return (
              <Link
                key={c.slug}
                href={c.slug ? `/vendors?city=${encodeURIComponent(city)}&category=${c.slug}` : `/vendors?city=${encodeURIComponent(city)}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-950 text-white'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 font-medium">Sort By:</span>
          <select className="px-3.5 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 bg-zinc-50 focus:outline-none">
            <option value="recommended">Recommended</option>
            <option value="rating">Highest Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="reviews">Most Reviewed</option>
          </select>
        </div>

      </div>

      {/* Vendors Grid or Expansion State */}
      {vendors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor: any) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <LocalExpansionCard city={city} />
      )}

    </div>
  );
}
