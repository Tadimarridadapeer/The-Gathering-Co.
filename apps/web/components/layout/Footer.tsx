import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-16 pb-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-zinc-900">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-flex flex-col font-newsreader-36pt text-white leading-[0.9] tracking-[-0.02em] select-none">
              <span className="text-[14px] font-normal tracking-tight text-zinc-300">The</span>
              <span className="text-[24px] font-normal tracking-tight text-white">Gathering Co.</span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed pt-1">
              India&apos;s premier managed event-planning platform by The Gathering Co. Discover, compare, shortlist, and book 100% verified venues, caterers, decorators, and photographers with zero hidden markups.
            </p>
            <div className="flex items-center gap-2 text-xs text-rose-500 font-medium pt-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>India &bull; Live in Anantapur & Kadapa</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Planning Tools</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/my-event" className="hover:text-white transition-colors">
                  Event Builder
                </Link>
              </li>
              <li>
                <Link href="/my-event" className="hover:text-white transition-colors">
                  Budget Calculator
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-white transition-colors">
                  Vendor Marketplace
                </Link>
              </li>
              <li>
                <Link href="/inspiration" className="hover:text-white transition-colors">
                  Inspiration Board
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Top Categories in Rayalaseema</h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/vendors?category=venues" className="hover:text-white transition-colors">
                  AC Convention Halls & Venues
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=photographers" className="hover:text-white transition-colors">
                  Candid Wedding Photographers
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=decorators" className="hover:text-white transition-colors">
                  Telugu Mandap Decorators
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=caterers" className="hover:text-white transition-colors">
                  Rayalaseema Traditional Caterers
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Verified Managed Platform</h4>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="text-xs font-bold text-rose-500">
                100% Manually Verified
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Every vendor across our live hubs is personally inspected in person and verified by our on-ground curation team.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 The Gathering Co. Technologies India. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-zinc-400">Made for Celebrations Across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
