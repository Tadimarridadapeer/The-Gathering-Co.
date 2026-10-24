import Link from 'next/link';
import { HeroSection } from '@/components/ui/HeroSection';
import { FeaturedVendorsSection } from '@/components/ui/FeaturedVendorsSection';
import { getVendorsByCity } from '@/lib/anantapur-vendors';

async function getFeaturedVendors(city: string = 'Anantapur') {
  try {
    const res = await fetch(`http://localhost:4000/api/vendors?city=${encodeURIComponent(city)}&limit=4`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      return data.items || [];
    }
  } catch (e) {}

  return getVendorsByCity(city).slice(0, 4);
}

export default async function HomePage() {
  const vendors = await getFeaturedVendors('Anantapur');

  return (
    <div className="space-y-20 pb-20">
      
      {/* EDITORIAL LOCATION-AWARE HERO */}
      <HeroSection />

      {/* EVENT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">
              Celebrations in Anantapur
            </h2>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-zinc-950">
              What are you celebrating?
            </h3>
          </div>
          <Link
            href="/vendors"
            className="text-xs font-bold text-zinc-800 hover:text-rose-600 transition-colors"
          >
            View All Categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { name: 'Wedding', count: '120+ Vendors', slug: 'wedding' },
            { name: 'Engagement', count: '80+ Vendors', slug: 'engagement' },
            { name: 'Reception', count: '90+ Vendors', slug: 'reception' },
            { name: 'Birthday', count: '65+ Vendors', slug: 'birthday' },
            { name: 'Baby Shower', count: '40+ Vendors', slug: 'baby-shower' },
            { name: 'Housewarming', count: '55+ Vendors', slug: 'housewarming' },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/vendors?category=${cat.slug}`}
              className="group p-5 rounded-2xl bg-white border border-zinc-200 hover:border-rose-600 hover:shadow-hover transition-all text-center space-y-2"
            >
              <h4 className="font-serif font-bold text-sm text-zinc-950 group-hover:text-rose-600 transition-colors">
                {cat.name}
              </h4>
              <p className="text-[11px] text-zinc-400 font-medium">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3 SIMPLE STEPS */}
      <section className="bg-zinc-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">
              Simple & Seamless
            </h2>
            <h3 className="font-serif font-bold text-3xl text-white">
              Plan your event in 3 simple steps
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-serif font-bold text-lg text-white">Choose Your Event</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Select event type in Anantapur, date, estimated guest count, and budget parameters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-serif font-bold text-lg text-white">Get Custom Budget Split</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Our Event Builder workspace generates recommended cost allocation across venue, food, decor & photos.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-serif font-bold text-lg text-white">Discover & Book Verified Vendors</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Browse hand-picked top vendors in Anantapur, request direct quotes, and lock in your bookings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION-AWARE FEATURED VENDORS OR EXPANSION BANNER */}
      <FeaturedVendorsSection initialVendors={vendors} initialCity="Anantapur" />

      {/* INSPIRATION HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">
              Event Inspiration
            </span>
            <h3 className="font-serif font-bold text-3xl sm:text-4xl text-white leading-tight">
              Minimal Telugu Wedding Setup in Anantapur
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Looking for traditional Telugu mandaps, marigold entries, and banana leaf dining setups? Explore curated inspiration boards built for Rayalaseema weddings.
            </p>
            <div className="text-xs font-bold text-rose-400 pt-1">
              Estimated: ₹2.5L – ₹4L &bull; Anantapur Venues
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/my-event?eventType=Wedding&budget=350000"
              className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs text-center transition-colors shadow-md"
            >
              Build This Event
            </Link>
            <Link
              href="/inspiration"
              className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs text-center border border-zinc-800 transition-colors"
            >
              Browse Inspiration
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="max-w-2xl mx-auto">
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-zinc-950 mb-2">
            Why people in Anantapur trust The Gathering Co.
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500">
            We operate as a managed marketplace. Every business is personally verified in Anantapur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-2">
            <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">Personally Verified</div>
            <h4 className="font-serif font-bold text-base text-zinc-950">Local Verification</h4>
            <p className="text-xs text-zinc-500">
              Our team inspects convention halls, meets caterers, and verifies physical addresses in Anantapur.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-2">
            <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">Direct Quotes</div>
            <h4 className="font-serif font-bold text-base text-zinc-950">Managed Quotes</h4>
            <p className="text-xs text-zinc-500">
              Submit requirements once, receive transparent quote options directly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200 space-y-2">
            <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">Event System</div>
            <h4 className="font-serif font-bold text-base text-zinc-950">Complete Workspace</h4>
            <p className="text-xs text-zinc-500">
              Track tasks and manage budget allocations inside your `/my-event` command center.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
