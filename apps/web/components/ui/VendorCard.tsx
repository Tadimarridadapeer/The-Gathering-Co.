'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart } from 'lucide-react';
import { QuoteRequestModal } from './QuoteRequestModal';

export interface VendorProps {
  id: string;
  businessName: string;
  slug: string;
  categoryName?: string;
  city: string;
  address: string;
  startingPrice: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured?: boolean;
  coverImage?: string;
  shortDescription: string;
}

export const VendorCard = ({ vendor }: { vendor: VendorProps }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  return (
    <>
      <div className="group bg-white rounded-3xl overflow-hidden border border-zinc-200 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between">
        
        {/* Cover Image & Badges */}
        <div className="relative h-56 w-full bg-zinc-100 overflow-hidden">
          <Image
            src={
              vendor.coverImage ||
              'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800'
            }
            alt={vendor.businessName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

          {/* Badges Top Left */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {vendor.verified && (
              <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-bold tracking-wide">
                Verified
              </span>
            )}
            {vendor.featured && (
              <span className="px-2.5 py-1 rounded-full bg-zinc-950 text-white text-[10px] font-bold tracking-wide">
                Featured
              </span>
            )}
          </div>

          {/* Save Heart Top Right */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600 text-rose-600' : 'text-white'}`} />
          </button>

          {/* Rating Bottom Right */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-white text-zinc-950 text-xs font-bold flex items-center gap-1 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>{(Number(vendor.rating) || 5.0).toFixed(1)}</span>
            <span className="text-[10px] text-zinc-500 font-normal">({vendor.reviewCount})</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
              <span className="text-rose-600 font-bold uppercase tracking-wider text-[11px]">
                {vendor.categoryName || 'Event Vendor'}
              </span>
              <span className="text-zinc-500 font-semibold">{vendor.city}</span>
            </div>

            <Link href={`/vendors/${vendor.slug}`} className="block mt-1">
              <h3 className="font-serif font-bold text-lg text-zinc-950 hover:text-rose-600 transition-colors line-clamp-1">
                {vendor.businessName}
              </h3>
            </Link>

            <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
              {vendor.shortDescription}
            </p>
          </div>

          {/* Pricing & Actions */}
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Starting from</span>
              <span className="text-sm font-extrabold text-zinc-950">
                ₹{vendor.startingPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/vendors/${vendor.slug}`}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors"
              >
                View
              </Link>
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors"
              >
                Quote
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Managed Quote Modal */}
      {quoteModalOpen && (
        <QuoteRequestModal
          vendorId={vendor.id}
          vendorName={vendor.businessName}
          onClose={() => setQuoteModalOpen(false)}
        />
      )}
    </>
  );
};
