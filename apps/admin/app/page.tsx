'use client';

import React, { useState } from 'react';
import { ShieldCheck, Plus, Lock, X, Check, Trash2, Edit2, MapPin } from 'lucide-react';
import { ImageDragDrop } from '@/components/ui/ImageDragDrop';

const VENDOR_CATEGORIES = [
  'Venues',
  'Photographers',
  'Videographers',
  'Decorators',
  'Caterers',
  'Makeup Artists',
  'Mehendi Artists',
  'DJs',
  'Musicians',
  'Anchors',
  'Event Planners',
  'Wedding Cars',
  'Invitation Designers',
  'Return Gifts',
  'Purohits',
];

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('admin@thegatheringco.com');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vendors' | 'quotes'>('dashboard');

  // Add Vendor Modal State
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [submittingVendor, setSubmittingVendor] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Vendor Form Fields
  const [newVendorForm, setNewVendorForm] = useState({
    businessName: '',
    category: 'Venues',
    city: 'Anantapur',
    address: '',
    phone: '',
    email: '',
    startingPrice: '',
    verified: true,
    featured: false,
    shortDescription: '',
    description: '',
    coverImage: '',
  });

  // Vendors list
  const [vendors, setVendors] = useState([
    {
      id: 'v1',
      businessName: 'Royal Grand Convention Hall',
      slug: 'royal-grand-convention-hall-anantapur',
      category: 'Venues',
      city: 'Anantapur',
      address: 'Subash Road, Anantapur',
      startingPrice: 120000,
      rating: 4.8,
      verified: true,
      featured: true,
      status: 'PUBLISHED',
      phone: '+91 9440112233',
      coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'v2',
      businessName: 'Rayalaseema Elite Catering',
      slug: 'rayalaseema-elite-catering-anantapur',
      category: 'Caterers',
      city: 'Anantapur',
      address: 'Kamala Nagar, Anantapur',
      startingPrice: 350,
      rating: 4.9,
      verified: true,
      featured: true,
      status: 'PUBLISHED',
      phone: '+91 9440889900',
      coverImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'v3',
      businessName: 'Sri Krishna Floral & Mandap Decorators',
      slug: 'sri-krishna-decorators-anantapur',
      category: 'Decorators',
      city: 'Anantapur',
      address: 'RTC Bus Stand Road, Anantapur',
      startingPrice: 45000,
      rating: 4.7,
      verified: true,
      featured: true,
      status: 'PUBLISHED',
      phone: '+91 9849223344',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'v4',
      businessName: 'Sri Valli Candid Wedding Photography',
      slug: 'sri-valli-photography-anantapur',
      category: 'Photographers',
      city: 'Anantapur',
      address: 'Bellary Road, Anantapur',
      startingPrice: 65000,
      rating: 4.9,
      verified: true,
      featured: true,
      status: 'PUBLISHED',
      phone: '+91 9989001122',
      coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'v5',
      businessName: 'DSR Paradise Function Hall',
      slug: 'dsr-paradise-function-hall-kadapa',
      category: 'Venues',
      city: 'Kadapa',
      address: 'Bachchimpalle, near Tirupati Bypass Road, Kadapa',
      startingPrice: 85000,
      rating: 4.8,
      verified: true,
      featured: true,
      status: 'PUBLISHED',
      phone: '+91 90145 47683',
      coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'v6',
      businessName: 'A.L Studios',
      slug: 'al-studios-kadapa',
      category: 'Photographers',
      city: 'Kadapa',
      address: 'Maria Puram, Nagarajupeta, Kadapa',
      startingPrice: 45000,
      rating: 4.9,
      verified: true,
      featured: true,
      status: 'PUBLISHED',
      phone: '+91 91828 51698',
      coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800',
    },
  ]);

  // Quotes list
  const [quotes, setQuotes] = useState([
    {
      id: 'q1',
      vendorName: 'Royal Grand Convention Hall',
      userName: 'Anusha Reddy',
      phone: '+91 9876543210',
      email: 'anusha@example.com',
      eventType: 'Wedding',
      guestCount: 500,
      eventDate: '2026-12-15',
      status: 'PENDING',
      city: 'Anantapur',
    },
    {
      id: 'q2',
      vendorName: 'DSR Paradise Function Hall',
      userName: 'Venkata Reddy',
      phone: '+91 9885143210',
      email: 'venkat@example.com',
      eventType: 'Wedding',
      guestCount: 600,
      eventDate: '2026-11-20',
      status: 'CONTACTED',
      city: 'Kadapa',
    },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((email === 'admin@thegatheringco.com' || email === 'admin@planmyevent.com') && password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid admin email or password');
    }
  };

  const toggleVerify = (id: string) => {
    setVendors(vendors.map((v) => (v.id === id ? { ...v, verified: !v.verified } : v)));
  };

  const toggleFeatured = (id: string) => {
    setVendors(vendors.map((v) => (v.id === id ? { ...v, featured: !v.featured } : v)));
  };

  const handleDeleteVendor = (id: string) => {
    if (confirm('Are you sure you want to remove this vendor from marketplace?')) {
      setVendors(vendors.filter((v) => v.id !== id));
      setNotification('Vendor deleted successfully.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const updateQuoteStatus = (id: string, newStatus: string) => {
    setQuotes(quotes.map((q) => (q.id === id ? { ...q, status: newStatus } : q)));
  };

  // Create Vendor Handler
  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingVendor(true);

    const citySlug = (newVendorForm.city || 'anantapur').toLowerCase();
    const slug = newVendorForm.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${citySlug}`;
    const startingPriceNum = Number(newVendorForm.startingPrice) || 25000;

    const newVendorObj = {
      id: 'v-' + Date.now(),
      businessName: newVendorForm.businessName,
      slug,
      category: newVendorForm.category,
      city: newVendorForm.city || 'Anantapur',
      address: newVendorForm.address || `${newVendorForm.city}, AP`,
      startingPrice: startingPriceNum,
      rating: 5.0,
      verified: newVendorForm.verified,
      featured: newVendorForm.featured,
      status: 'PUBLISHED',
      phone: newVendorForm.phone || '+91 9876543210',
      coverImage: newVendorForm.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    };

    try {
      await fetch('http://localhost:4000/api/vendors/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: newVendorForm.businessName,
          slug,
          categoryId: newVendorForm.category.toLowerCase(),
          description: newVendorForm.description || newVendorForm.shortDescription,
          shortDescription: newVendorForm.shortDescription,
          city: newVendorForm.city || 'Anantapur',
          address: newVendorForm.address,
          phone: newVendorForm.phone,
          email: newVendorForm.email,
          startingPrice: startingPriceNum,
          verified: newVendorForm.verified,
          featured: newVendorForm.featured,
          coverImage: newVendorObj.coverImage,
        }),
      });
    } catch (err) {}

    setVendors([newVendorObj, ...vendors]);
    setSubmittingVendor(false);
    setShowAddVendorModal(false);
    setNotification(`Successfully registered "${newVendorForm.businessName}" under ${newVendorForm.category}!`);

    // Reset Form
    setNewVendorForm({
      businessName: '',
      category: 'Venues',
      city: 'Anantapur',
      address: '',
      phone: '',
      email: '',
      startingPrice: '',
      verified: true,
      featured: false,
      shortDescription: '',
      description: '',
      coverImage: '',
    });

    setTimeout(() => setNotification(null), 4000);
  };

  const filteredVendors = selectedCategoryFilter
    ? vendors.filter((v) => v.category.toLowerCase() === selectedCategoryFilter.toLowerCase())
    : vendors;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-100">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-zinc-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="w-6 h-6 text-rose-500" />
            </div>
            <h1 className="font-serif font-bold text-2xl text-zinc-950">The Gathering Co.</h1>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
              Dedicated Admin Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-rose-500" /> Log In to Admin Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Internal Management Dashboard &bull; Dedicated Admin Portal
          </div>
          <h1 className="font-serif font-bold text-3xl text-zinc-950">
            Marketplace Operations Admin
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vendors'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Vendors ({vendors.length})
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'quotes'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Quote Requests ({quotes.length})
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-4 rounded-2xl bg-zinc-950 text-white text-xs font-bold shadow-md animate-fadeIn">
          ✓ {notification}
        </div>
      )}

      {/* 1. DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-card space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Vendors</span>
              <div className="font-serif font-extrabold text-3xl text-zinc-950">
                {vendors.length}
              </div>
              <p className="text-[11px] text-zinc-500">100% In-Person Verified</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-card space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Quote Requests</span>
              <div className="font-serif font-extrabold text-3xl text-zinc-950">
                {quotes.length}
              </div>
              <p className="text-[11px] text-zinc-500">Concierge inquiries</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-card space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Live Active Hubs</span>
              <div className="font-serif font-extrabold text-3xl text-zinc-950">2</div>
              <p className="text-[11px] text-zinc-500">Anantapur &amp; Kadapa (Andhra Pradesh)</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-card space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Events Created</span>
              <div className="font-serif font-extrabold text-3xl text-zinc-950">24</div>
              <p className="text-[11px] text-zinc-500">User workspaces active</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. VENDORS TAB */}
      {activeTab === 'vendors' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif font-bold text-2xl text-zinc-950">Vendor Management</h2>
              <p className="text-xs text-zinc-500">Add, verify, and curate local businesses across active hubs</p>
            </div>

            <button
              onClick={() => setShowAddVendorModal(true)}
              className="px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-rose-500" /> Add New Vendor
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategoryFilter('')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                !selectedCategoryFilter ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              All Categories ({vendors.length})
            </button>
            {VENDOR_CATEGORIES.map((cat) => {
              const count = vendors.filter((v) => v.category.toLowerCase() === cat.toLowerCase()).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategoryFilter.toLowerCase() === cat.toLowerCase()
                      ? 'bg-zinc-950 text-white'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {cat} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>

          {/* Vendor Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Business Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Starting Price</th>
                  <th className="py-3 px-4">Verified</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-medium text-zinc-900">
                {filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-zinc-50">
                    <td className="py-3.5 px-4 font-bold text-zinc-950">{v.businessName}</td>
                    <td className="py-3.5 px-4 text-zinc-600 font-semibold">{v.category}</td>
                    <td className="py-3.5 px-4 text-zinc-500 font-medium">{v.city}</td>
                    <td className="py-3.5 px-4 font-extrabold text-zinc-950">₹{v.startingPrice.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleVerify(v.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                          v.verified
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        {v.verified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleFeatured(v.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                          v.featured
                            ? 'bg-zinc-950 text-white'
                            : 'bg-zinc-100 text-zinc-500'
                        }`}
                      >
                        {v.featured ? 'Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteVendor(v.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ADD VENDOR MODAL WITH DRAG & DROP IMAGE UPLOAD */}
      {showAddVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-zinc-200 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddVendorModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                Category Onboarding
              </span>
              <h3 className="font-serif font-bold text-2xl text-zinc-950">
                Add New Vendor
              </h3>
              <p className="text-xs text-zinc-500">
                Register a verified local event business with drag &amp; drop image upload.
              </p>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">Business Name *</label>
                  <input
                    required
                    type="text"
                    value={newVendorForm.businessName}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, businessName: e.target.value })}
                    placeholder="e.g. Sri Balaji Caterers"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">Category *</label>
                  <select
                    value={newVendorForm.category}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {VENDOR_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">Starting Price (₹) *</label>
                  <input
                    required
                    type="number"
                    value={newVendorForm.startingPrice}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, startingPrice: e.target.value })}
                    placeholder="e.g. 35000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">City / Hub *</label>
                  <select
                    value={newVendorForm.city}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="Anantapur">Anantapur, Andhra Pradesh</option>
                    <option value="Kadapa">Kadapa, Andhra Pradesh</option>
                    <option value="Kurnool">Kurnool, Andhra Pradesh</option>
                    <option value="Tirupati">Tirupati, Andhra Pradesh</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">Physical Address *</label>
                <input
                  required
                  type="text"
                  value={newVendorForm.address}
                  onChange={(e) => setNewVendorForm({ ...newVendorForm, address: e.target.value })}
                  placeholder="e.g. Trunk Road, near Seven Roads Circle, Kadapa"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={newVendorForm.phone}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, phone: e.target.value })}
                    placeholder="+91 9440011223"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newVendorForm.email}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, email: e.target.value })}
                    placeholder="contact@business.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">Short Description *</label>
                <input
                  required
                  type="text"
                  value={newVendorForm.shortDescription}
                  onChange={(e) => setNewVendorForm({ ...newVendorForm, shortDescription: e.target.value })}
                  placeholder="One line summary for search cards..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* DRAG AND DROP IMAGE UPLOAD COMPONENT */}
              <ImageDragDrop
                label="Vendor Cover Image (Drag & Drop or Click to Browse)"
                currentImage={newVendorForm.coverImage}
                onImageSelected={(imageData) => setNewVendorForm({ ...newVendorForm, coverImage: imageData })}
              />

              {/* Badges Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newVendorForm.verified}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, verified: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                  />
                  Mark as Verified Business
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newVendorForm.featured}
                    onChange={(e) => setNewVendorForm({ ...newVendorForm, featured: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                  />
                  Mark as Featured Listing
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submittingVendor}
                  className="flex-1 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {submittingVendor ? 'Publishing Vendor...' : 'Publish Vendor'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddVendorModal(false)}
                  className="px-5 py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 4. QUOTE REQUESTS TAB */}
      {activeTab === 'quotes' && (
        <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-2xl text-zinc-950">Incoming Managed Quotes</h2>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              Concierge Managed Marketplace
            </span>
          </div>

          <div className="space-y-4">
            {quotes.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-lg text-zinc-950">{q.vendorName}</span>
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                      {q.eventType}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">
                    User: <span className="font-bold text-zinc-950">{q.userName}</span> ({q.phone} &bull; {q.email})
                  </p>
                  <p className="text-xs text-zinc-500">
                    Event Date: {q.eventDate} &bull; Guests: {q.guestCount} &bull; Location: {q.city}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={q.status}
                    onChange={(e) => updateQuoteStatus(q.id, e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-900 bg-white"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="QUOTED">QUOTED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
