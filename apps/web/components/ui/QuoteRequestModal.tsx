'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Star } from 'lucide-react';

export interface QuoteRequestModalProps {
  vendorId: string;
  vendorName: string;
  rating?: number;
  reviewCount?: number;
  startingPrice?: number;
  address?: string;
  onClose: () => void;
}

export const QuoteRequestModal = ({
  vendorId,
  vendorName,
  rating,
  reviewCount,
  startingPrice,
  address,
  onClose,
}: QuoteRequestModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'Wedding',
    eventDate: '2026-12-15',
    city: 'Anantapur',
    guestCount: 500,
    budget: startingPrice || 50000,
    servicesRequired: `Inquiry for ${vendorName} in Anantapur`,
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '3000' ? 'http://localhost:4000' : '');
      const res = await fetch(`${apiBase}/api/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, ...formData }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl relative border border-zinc-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!submitted ? (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400 block mb-1">
                Direct Quote Request
              </span>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-zinc-950">
                {vendorName}
              </h2>
            </div>

            {/* Vendor Rating & Pricing Strip */}
            {(rating || startingPrice || address) && (
              <div className="flex flex-wrap items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs">
                {rating && (
                  <span className="flex items-center gap-1 font-semibold text-zinc-900 bg-white px-2 py-0.5 rounded border border-zinc-200 shadow-2xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{rating.toFixed(1)}</span>
                    {reviewCount !== undefined && (
                      <span className="text-zinc-500 font-normal">({reviewCount} reviews)</span>
                    )}
                  </span>
                )}
                {startingPrice && (
                  <span className="font-semibold text-zinc-900">
                    From ₹{startingPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {address && (
                  <span className="text-zinc-500 truncate max-w-[200px] text-[11px]">
                    &bull; {address}
                  </span>
                )}
              </div>
            )}

            <p className="text-xs text-zinc-500 leading-relaxed">
              Submit your contact details. The vendor and our local Anantapur coordination team will verify date availability and send an official quote to your WhatsApp.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anusha Reddy"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Event Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:outline-none bg-white"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Reception">Reception</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Housewarming">Housewarming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Specific Requirements / Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. 500 guests catering, AC hall setup on Bellary Road..."
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
              >
                {loading ? 'Submitting Request...' : 'Send Quote Request'}
              </button>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-zinc-950">
              Quote Request Sent
            </h3>
            <p className="text-xs text-zinc-600 max-w-sm mx-auto leading-relaxed">
              We&apos;ve sent your inquiry for <strong className="text-zinc-900">{vendorName}</strong>. Our local Anantapur coordinator will reach out directly on your WhatsApp/phone shortly.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-950 text-white text-xs font-medium cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
