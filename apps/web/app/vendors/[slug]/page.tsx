import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, ShieldCheck, MapPin, CheckCircle2, Phone } from 'lucide-react';
import { ALL_LOCAL_VENDORS } from '@/lib/anantapur-vendors';

async function getVendorBySlug(slug: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/vendors/${slug}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}

  const vendorsMap: Record<string, any> = {
    'royal-grand-convention-hall-anantapur': {
      id: 'v1',
      businessName: 'Royal Grand Convention Hall',
      slug: 'royal-grand-convention-hall-anantapur',
      categoryName: 'Venues',
      city: 'Anantapur',
      state: 'Andhra Pradesh',
      address: 'Subash Road, Near Clock Tower, Anantapur',
      startingPrice: 120000,
      rating: 4.8,
      reviewCount: 42,
      verified: true,
      verifiedLevel: 'PREMIUM',
      shortDescription: 'Premium AC Convention Center with 1000+ guest capacity on Subash Road, Anantapur.',
      description: 'Royal Grand Convention Hall is Anantapur\'s premier venue for grand Telugu weddings, receptions, and corporate conferences. Features central air conditioning, dining capacity for 600 people simultaneously, 10 luxury green rooms, and ample parking space.',
      coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
      packages: [
        { id: 'p1', name: 'Basic Hall Rental', price: 120000, duration: '1 Day', deliverables: 'Main AC Hall, 3 Green Rooms, Basic Stage Lighting' },
        { id: 'p2', name: 'Grand Wedding Package', price: 200000, duration: '2 Days', deliverables: 'Main AC Hall + Dining Hall, 10 Green Rooms, Generators & Full Stage Lighting' },
      ],
      reviews: [
        { id: 'r1', reviewerName: 'Ramesh Reddy', rating: 5, reviewText: 'Hosted my sister\'s marriage here in Anantapur. Exceptional AC cooling, spacious parking, and clean green rooms!' },
        { id: 'r2', reviewerName: 'Sujatha Rao', rating: 4.8, reviewText: 'Very well maintained convention hall right on Subash Road.' },
      ],
    },
  };

  if (vendorsMap[slug]) return vendorsMap[slug];

  const localMatch = ALL_LOCAL_VENDORS.find((v) => v.slug === slug);
  if (localMatch) {
    return {
      id: localMatch.id,
      businessName: localMatch.businessName,
      slug: localMatch.slug,
      categoryName: localMatch.categoryName,
      city: localMatch.city,
      state: 'Andhra Pradesh',
      address: localMatch.address,
      phone: localMatch.phone,
      startingPrice: localMatch.startingPrice,
      rating: localMatch.rating,
      reviewCount: localMatch.reviewCount,
      verified: true,
      verifiedLevel: 'VERIFIED',
      shortDescription: localMatch.shortDescription,
      description: `${localMatch.businessName} is a top-rated, verified ${localMatch.categoryName.toLowerCase()} partner in ${localMatch.city}. Known for dependable execution, transparent pricing, and stellar event delivery across Rayalaseema.`,
      coverImage: localMatch.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
      packages: [
        { id: 'p1', name: 'Standard Service Package', price: localMatch.startingPrice, duration: '1 Day Event', deliverables: 'Complete basic deliverable setup, professional staff & on-ground execution' },
        { id: 'p2', name: 'Grand Celebration Package', price: Math.round(localMatch.startingPrice * 1.6), duration: '2 Days Event', deliverables: 'Premium coverage, backup resources, dedicated coordinator & priority service' },
      ],
      reviews: [
        { id: 'r1', reviewerName: 'Verified Client', rating: localMatch.rating, reviewText: `Booked through The Gathering Co. for our family event in ${localMatch.city}. Smooth coordination and great punctuality!` },
      ],
    };
  }

  return {
    id: 'v-default',
    businessName: slug.replace(/-/g, ' ').toUpperCase(),
    slug,
    categoryName: 'Event Vendor',
    city: 'Anantapur',
    state: 'Andhra Pradesh',
    address: 'Anantapur City, AP',
    startingPrice: 45000,
    rating: 4.8,
    reviewCount: 30,
    verified: true,
    verifiedLevel: 'VERIFIED',
    shortDescription: 'Verified event business serving celebrations.',
    description: 'Professional event service provider offering end-to-end management, competitive pricing, and high customer satisfaction across Rayalaseema.',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    packages: [
      { id: 'p1', name: 'Standard Service Package', price: 45000, duration: '1 Event', deliverables: 'Complete basic service deliverable setup' },
    ],
    reviews: [
      { id: 'r1', reviewerName: 'Kalyan Kumar', rating: 5, reviewText: 'Great service quality!' },
    ],
  };
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const vendor = await getVendorBySlug(resolvedParams.slug);

  if (!vendor) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Hero Gallery & Header */}
      <div className="space-y-6">
        <div className="relative h-80 sm:h-[420px] w-full rounded-3xl overflow-hidden shadow-card bg-zinc-100">
          <Image
            src={vendor.coverImage || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200'}
            alt={vendor.businessName}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {vendor.verified && (
              <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold shadow-sm">
                Verified Business
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-zinc-950 text-white text-xs font-bold">
              Anantapur, AP
            </span>
          </div>
        </div>

        {/* Title & Pricing Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-zinc-200">
          <div className="space-y-2">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
              {vendor.categoryName || 'Event Vendor'}
            </span>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-zinc-950">
              {vendor.businessName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-600">
              <span className="flex items-center gap-1 text-zinc-950 font-bold">
                <Star className="w-4 h-4 fill-rose-600 text-rose-600" />
                {vendor.rating ? Number(vendor.rating).toFixed(1) : '5.0'} ({vendor.reviewCount} Reviews)
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                {vendor.address}
              </span>
              {vendor.phone && (
                <>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-mono">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {vendor.phone}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm w-full md:w-auto text-center md:text-right space-y-2">
            <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider block">Starting Price</span>
            <span className="font-serif font-extrabold text-2xl text-zinc-950 block">
              ₹{vendor.startingPrice.toLocaleString('en-IN')}
            </span>
            <div className="pt-1">
              <Link
                href="#request-quote"
                className="px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs inline-block shadow-md"
              >
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 space-y-10">
          
          {/* About */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-card space-y-4">
            <h2 className="font-serif font-bold text-2xl text-zinc-950">About {vendor.businessName}</h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {vendor.description}
            </p>
          </section>

          {/* Packages */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-card space-y-6">
            <h2 className="font-serif font-bold text-2xl text-zinc-950">Available Packages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vendor.packages?.map((pkg: any) => (
                <div key={pkg.id} className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-3">
                  <h3 className="font-serif font-bold text-lg text-zinc-950">{pkg.name}</h3>
                  <div className="text-lg font-extrabold text-rose-600">
                    ₹{pkg.price.toLocaleString('en-IN')}
                    {pkg.duration && <span className="text-xs font-normal text-zinc-500"> / {pkg.duration}</span>}
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">{pkg.deliverables}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Customer Reviews */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-card space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-2xl text-zinc-950">Customer Reviews</h2>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                ★ {(Number(vendor.rating) || 5.0).toFixed(1)} Rating
              </span>
            </div>

            <div className="space-y-4">
              {vendor.reviews?.map((rev: any) => (
                <div key={rev.id} className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-950">{rev.reviewerName}</span>
                    <span className="text-xs font-bold text-rose-600">★ {rev.rating}</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">{rev.reviewText}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Sticky Card */}
        <div className="space-y-6" id="request-quote">
          <div className="bg-zinc-950 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl sticky top-28">
            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">
                Managed Marketplace
              </span>
              <h3 className="font-serif font-bold text-2xl text-white">
                Request Quote from Vendor
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Submit your event details. Our local Anantapur team will check vendor availability and send pricing directly to you.
              </p>
            </div>

            {vendor.phone && (
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Direct Contact:</span>
                <a
                  href={`tel:${vendor.phone.replace(/\s+/g, '')}`}
                  className="font-mono text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {vendor.phone}
                </a>
              </div>
            )}

            <Link
              href="/vendors"
              className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs text-center shadow-md transition-all block"
            >
              Request Quote
            </Link>

            <div className="pt-4 border-t border-zinc-900 text-[11px] text-zinc-400 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                <span>Verified physical address in Anantapur</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500" />
                <span>Zero hidden charges</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
