'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  X,
  Check,
  Trash2,
  Plus,
  AlertCircle,
  Star,
  Phone,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Building2,
  Utensils,
  Camera,
  Palette,
  Flower2,
  Mail,
  Music,
  Car,
  Gift,
} from 'lucide-react';
import { useLocation } from '@/lib/location-context';
import {
  ANANTAPUR_VENDORS,
  KADAPA_VENDORS,
  getVendorsForCategory,
  mapCategoryToSlug,
  isCitySupported,
  VendorItem,
} from '@/lib/anantapur-vendors';
import { QuoteRequestModal } from '@/components/ui/QuoteRequestModal';
import { LocalExpansionCard } from '@/components/ui/LocalExpansionCard';

interface BudgetItem {
  category: string;
  categorySlug: string;
  allocatedAmount: number;
  spentAmount: number;
  breakdownDetail?: string;
}

interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  category: string;
}

const BUDGET_PRESETS = [
  { label: '₹90,000', value: 90000 },
  { label: '₹1.5 Lakhs', value: 150000 },
  { label: '₹3 Lakhs', value: 300000 },
  { label: '₹5 Lakhs', value: 500000 },
  { label: '₹8 Lakhs', value: 800000 },
  { label: '₹12 Lakhs', value: 1200000 },
  { label: '₹20 Lakhs+', value: 2000000 },
];

const PRESET_MILESTONES = [
  { title: 'Book DJ & Sound System for Sangeet', category: 'Music & DJ' },
  { title: 'Arrange Guest Transportation & Buses', category: 'Logistics' },
  { title: 'Finalize Mehendi & Haldi Artists', category: 'Makeup & Mehendi' },
  { title: 'Order Welcome Drink & Snack Stalls', category: 'Catering' },
  { title: 'Print & Send Digital Invitation Cards', category: 'Invitations' },
];

const MILESTONE_CATEGORIES = [
  'General',
  'Venue',
  'Catering',
  'Decoration',
  'Photography',
  'Makeup',
  'Music & DJ',
  'Logistics',
  'Invitations',
];

function getCategoryIcon(categorySlug: string) {
  switch (categorySlug) {
    case 'venues':
      return <Building2 className="w-4 h-4 text-zinc-700" />;
    case 'caterers':
      return <Utensils className="w-4 h-4 text-zinc-700" />;
    case 'photographers':
      return <Camera className="w-4 h-4 text-zinc-700" />;
    case 'makeup-artists':
      return <Palette className="w-4 h-4 text-zinc-700" />;
    case 'decorators':
      return <Flower2 className="w-4 h-4 text-zinc-700" />;
    case 'invitation-designers':
      return <Mail className="w-4 h-4 text-zinc-700" />;
    case 'djs':
      return <Music className="w-4 h-4 text-zinc-700" />;
    case 'wedding-cars':
      return <Car className="w-4 h-4 text-zinc-700" />;
    case 'return-gifts':
      return <Gift className="w-4 h-4 text-zinc-700" />;
    default:
      return <Sparkles className="w-4 h-4 text-zinc-700" />;
  }
}

function EventWorkspaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { location } = useLocation();
  const eventType = searchParams.get('eventType') || 'Wedding';
  const city = searchParams.get('city') || location.city || 'Anantapur';
  const eventDate = searchParams.get('eventDate') || '2026-12-15';
  const guestCount = Number(searchParams.get('guestCount')) || 500;
  const initialBudget = Number(searchParams.get('budget')) || 800000;

  const [totalBudget, setTotalBudget] = useState(initialBudget);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState(initialBudget);

  // Quote modal state
  const [quoteVendor, setQuoteVendor] = useState<VendorItem | null>(null);

  // Helper to get initial default selected vendors based on active city
  const getDefaultSelected = (cityName: string) => {
    const isK = cityName.toLowerCase() === 'kadapa';
    if (isK) {
      return {
        venues: KADAPA_VENDORS.find((v) => v.slug === 'dsr-paradise-function-hall-kadapa') || null,
        caterers: KADAPA_VENDORS.find((v) => v.slug === 'sri-balaji-caterers-kadapa') || null,
        photographers: KADAPA_VENDORS.find((v) => v.slug === 'al-studios-kadapa') || null,
        'makeup-artists': KADAPA_VENDORS.find((v) => v.slug === 'naari-makeovers-kadapa') || null,
      };
    }
    return {
      venues: ANANTAPUR_VENDORS.find((v) => v.slug === 'city-convention-hall-anantapur') || null,
      caterers: ANANTAPUR_VENDORS.find((v) => v.slug === 'rs-food-caterers-anantapur') || null,
      photographers: ANANTAPUR_VENDORS.find((v) => v.slug === 'smile-digital-photo-studio-anantapur') || null,
      'makeup-artists': ANANTAPUR_VENDORS.find((v) => v.slug === 'skynn-and-soul-beauty-salon-anantapur') || null,
    };
  };

  // Selected vendors per category slug
  const [selectedVendors, setSelectedVendors] = useState<Record<string, VendorItem | null>>(() =>
    getDefaultSelected(city)
  );

  useEffect(() => {
    setSelectedVendors(getDefaultSelected(city));
  }, [city]);

  // Expand only when user clicks "View Vendors". Default: ALL COLLAPSED.
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryExpand = (cat: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  // Dynamic realistic allocation engine
  const calculateAllocations = (budgetVal: number, type: string): BudgetItem[] => {
    const rules: Record<string, { category: string; pct: number; detail: string }[]> = {
      Wedding: [
        { category: 'Venue & Hall', pct: 0.15, detail: 'Main AC hall rental, green rooms & basic lighting' },
        { category: 'Catering & Meals', pct: 0.32, detail: 'Banana leaf feast / buffet meal per guest' },
        { category: 'Decoration & Mandap', pct: 0.18, detail: 'Stage backdrop, flower mandap & entrance arch' },
        { category: 'Photography & Video', pct: 0.12, detail: 'Candid photography, traditional video & album' },
        { category: 'Bridal Makeup', pct: 0.05, detail: 'HD makeup, hair styling & saree draping' },
        { category: 'Invitations & Cards', pct: 0.03, detail: 'Printed cards & digital video e-invites' },
        {
          category: 'Miscellaneous & Contingency',
          pct: 0.12,
          detail: 'Power backup generator, transport, cleaning crew & buffer reserve',
        },
      ],
      Engagement: [
        { category: 'Venue & Hall', pct: 0.20, detail: 'Function hall & stage setup' },
        { category: 'Catering & Meals', pct: 0.40, detail: 'Lunch / dinner buffet per guest' },
        { category: 'Decoration & Mandap', pct: 0.18, detail: 'Flower stage & ring ceremony backdrop' },
        { category: 'Photography & Video', pct: 0.12, detail: 'Candid photo & video coverage' },
        {
          category: 'Miscellaneous & Contingency',
          pct: 0.10,
          detail: 'Power backup, transport & incidental expenses',
        },
      ],
      Birthday: [
        { category: 'Venue & Hall', pct: 0.25, detail: 'Party space / hall rental' },
        { category: 'Catering & Meals', pct: 0.40, detail: 'Buffet dinner & welcome snacks' },
        { category: 'Decoration & Mandap', pct: 0.20, detail: 'Balloon arches & cake backdrop' },
        { category: 'Invitations & Cards', pct: 0.15, detail: 'Customized cards & return gift hampers' },
      ],
    };

    const selRules = rules[type] || rules['Wedding'];
    const commitFactor = 0.967;
    const effectiveSpendable = Math.round(budgetVal * commitFactor);

    return selRules.map((r) => {
      const allocated = Math.round(effectiveSpendable * r.pct);
      const catSlug = mapCategoryToSlug(r.category);
      return {
        category: r.category,
        categorySlug: catSlug,
        allocatedAmount: allocated,
        spentAmount: Math.round(allocated * 0.98),
        breakdownDetail: r.detail,
      };
    });
  };

  const [allocations, setAllocations] = useState<BudgetItem[]>(() =>
    calculateAllocations(initialBudget, eventType)
  );

  useEffect(() => {
    setAllocations(calculateAllocations(totalBudget, eventType));
  }, [totalBudget, eventType]);

  const totalCommittedSpent = allocations.reduce((sum, item) => sum + item.spentAmount, 0);
  const totalSavingsBuffer = Math.max(0, totalBudget - totalCommittedSpent);

  // Apply new budget from modal
  const handleApplyNewBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempBudgetInput <= 0) return;
    setTotalBudget(tempBudgetInput);
    setShowAdjustModal(false);

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('budget', tempBudgetInput.toString());
    router.replace(`/my-event?${newParams.toString()}`);
  };

  // Milestones tasks
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 't1', title: 'Lock venue date and pay confirmation advance', completed: true, category: 'Venue' },
    { id: 't2', title: 'Finalize menu options and dietary requirements with caterer', completed: true, category: 'Catering' },
    { id: 't3', title: 'Review photography package and sign contract', completed: false, category: 'Photography' },
    { id: 't4', title: 'Book bridal makeup trial session', completed: false, category: 'Makeup' },
    { id: 't5', title: 'Finalize mandap floral styling and stage entrance', completed: false, category: 'Decoration' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Venue');
  const [inputError, setInputError] = useState(false);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setInputError(true);
      return;
    }
    const newTask: TaskItem = {
      id: 'task_' + Date.now(),
      title: newTaskTitle.trim(),
      completed: false,
      category: selectedCategory,
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setInputError(false);
  };

  const addPresetMilestone = (preset: { title: string; category: string }) => {
    const alreadyExists = tasks.some((t) => t.title.toLowerCase() === preset.title.toLowerCase());
    if (alreadyExists) return;
    const newTask: TaskItem = {
      id: 'task_' + Date.now(),
      title: preset.title,
      completed: false,
      category: preset.category,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const completedTaskCount = tasks.filter((t) => t.completed).length;

  const handleSelectVendor = (catSlug: string, vendor: VendorItem) => {
    setSelectedVendors((prev) => ({
      ...prev,
      [catSlug]: vendor,
    }));
  };

  const handleRemoveSelectedVendor = (catSlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVendors((prev) => ({
      ...prev,
      [catSlug]: null,
    }));
  };

  const isSupported = isCitySupported(city);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Location Notice Banner if city has no local vendors yet */}
      {!isSupported && (
        <LocalExpansionCard city={city} />
      )}

      {/* Header Banner */}
      <div className="bg-zinc-950 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
            Event Plan Workspace
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            My {eventType} Plan
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300 pt-0.5">
            <span>
              {new Date(eventDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-white font-medium">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {city}
            </span>
            <span>&bull;</span>
            <span>{guestCount} Guests</span>
          </div>
        </div>

        {/* Budget Pill in Banner */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-xl text-center md:text-right min-w-[200px] space-y-1">
          <span className="text-[11px] text-zinc-400 font-medium block">
            Target Budget
          </span>
          <div className="flex items-center justify-center md:justify-end gap-2">
            <span className="font-serif font-bold text-2xl text-white">
              ₹{totalBudget.toLocaleString('en-IN')}
            </span>
            <button
              onClick={() => {
                setTempBudgetInput(totalBudget);
                setShowAdjustModal(true);
              }}
              className="px-2.5 py-1 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
            >
              Adjust
            </button>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Total Budget */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Planned Budget</span>
            <button
              onClick={() => {
                setTempBudgetInput(totalBudget);
                setShowAdjustModal(true);
              }}
              className="text-xs font-semibold text-zinc-900 hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="font-serif font-bold text-2xl text-zinc-950">
            ₹{totalBudget.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-zinc-500">Total planned cap for {eventType}</p>
        </div>

        {/* Card 2: Estimated Spend */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs space-y-1.5">
          <span className="text-xs font-semibold text-zinc-500">Estimated Committed</span>
          <div className="font-serif font-bold text-2xl text-zinc-950">
            ₹{totalCommittedSpent.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-zinc-500">Allocated across event services</p>
        </div>

        {/* Card 3: Contingency Buffer */}
        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200/80 shadow-xs space-y-1.5">
          <span className="text-xs font-semibold text-zinc-600">Reserve Buffer</span>
          <div className="font-serif font-bold text-2xl text-emerald-700">
            ₹{totalSavingsBuffer.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-zinc-500">Unallocated reserve for contingencies</p>
        </div>

      </div>

      {/* BUDGET ALLOCATION BREAKDOWN (ONLY SHOWS VENDORS WHEN USER CLICKS "VIEW VENDORS") */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-zinc-950">
              Budget Breakdown
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Service allocations for your celebration. Click &ldquo;View Vendors&rdquo; to browse and select providers in {city}.
            </p>
          </div>

          <button
            onClick={() => {
              setTempBudgetInput(totalBudget);
              setShowAdjustModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all"
          >
            Adjust Budget
          </button>
        </div>

        {/* List of Categories with Matched Vendors on Click */}
        <div className="divide-y divide-zinc-100">
          {allocations.map((item) => {
            const matchedVendors = getVendorsForCategory(item.categorySlug, city);
            const isExpanded = !!expandedCategories[item.category];
            const selected = selectedVendors[item.categorySlug];

            return (
              <div key={item.category} className="py-4 first:pt-0 last:pb-0 space-y-3">
                
                {/* Clean Row Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  
                  {/* Left: Category info & selected badge */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-zinc-100 text-zinc-700">
                        {getCategoryIcon(item.categorySlug)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm sm:text-base text-zinc-900">
                            {item.category}
                          </h3>
                          {matchedVendors.length > 0 && (
                            <span className="text-[11px] text-zinc-400 font-normal">
                              ({matchedVendors.length} {matchedVendors.length === 1 ? 'vendor' : 'vendors'})
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500">
                          {item.breakdownDetail}
                        </p>
                      </div>
                    </div>

                    {/* Selected Vendor Pill */}
                    {selected && (
                      <div className="mt-1.5 inline-flex flex-wrap items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>
                          Selected: <strong className="font-semibold text-zinc-950">{selected.businessName}</strong>
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-zinc-800 bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-[11px]">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{selected.rating.toFixed(1)}</span>
                          <span className="text-zinc-500 font-normal">({selected.reviewCount})</span>
                        </span>
                        <span className="text-zinc-600 font-medium text-[11px]">&bull; ₹{selected.startingPrice.toLocaleString('en-IN')}</span>
                        <button
                          onClick={(e) => handleRemoveSelectedVendor(item.categorySlug, e)}
                          className="text-[11px] text-zinc-500 hover:text-rose-600 ml-1 underline cursor-pointer font-medium"
                        >
                          Change
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: Allocation Amount & Action Buttons */}
                  <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-medium">
                        Allocated
                      </span>
                      <span className="font-serif font-bold text-base sm:text-lg text-zinc-950">
                        ₹{item.spentAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {matchedVendors.length > 0 && (
                        <button
                          onClick={() => toggleCategoryExpand(item.category)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                            isExpanded
                              ? 'bg-zinc-900 text-white border-zinc-900'
                              : 'bg-white hover:bg-zinc-50 text-zinc-800 border-zinc-200'
                          }`}
                        >
                          <span>{isExpanded ? 'Hide Vendors' : `View Vendors (${matchedVendors.length})`}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      {item.categorySlug && (
                        <Link
                          href={`/vendors?city=${encodeURIComponent(city)}&category=${item.categorySlug}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                        >
                          Browse All
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* EXPANDABLE VENDORS LIST: ONLY SHOWN WHEN USER CLICKS "VIEW VENDORS" */}
                {isExpanded && matchedVendors.length > 0 && (
                  <div className="mt-2 p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/70 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-700">
                        Verified {item.category} in {city}
                      </span>
                      <Link
                        href={`/vendors?city=${encodeURIComponent(city)}&category=${item.categorySlug}`}
                        className="text-zinc-500 hover:text-zinc-900 hover:underline flex items-center gap-1"
                      >
                        <span>Open directory</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {matchedVendors.map((vendor) => {
                        const isSelected = selected?.id === vendor.id;

                        return (
                          <div
                            key={vendor.id}
                            className={`p-3.5 rounded-xl border bg-white transition-all flex flex-col justify-between gap-3 ${
                              isSelected
                                ? 'border-emerald-500 ring-1 ring-emerald-500/30'
                                : 'border-zinc-200/80 hover:border-zinc-300 shadow-xs'
                            }`}
                          >
                            <div className="space-y-1.5">
                              {/* Vendor Header */}
                              <div className="flex items-start justify-between gap-2">
                                <Link
                                  href={`/vendors/${vendor.slug}`}
                                  className="font-medium text-sm text-zinc-900 hover:text-rose-600 transition-colors line-clamp-1"
                                >
                                  {vendor.businessName}
                                </Link>
                                <span className="flex-shrink-0 flex items-center gap-1 text-[11px] font-semibold text-zinc-800 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  {vendor.rating.toFixed(1)} <span className="text-zinc-500 font-normal">({vendor.reviewCount})</span>
                                </span>
                              </div>

                              {/* Address */}
                              <div className="flex items-center gap-1 text-[11px] text-zinc-500 line-clamp-1">
                                <MapPin className="w-3 h-3 flex-shrink-0 text-zinc-400" />
                                <span>{vendor.address}</span>
                              </div>

                              {/* Phone direct link */}
                              {vendor.phone && (
                                <div className="flex items-center gap-1 text-[11px] text-zinc-700 font-mono">
                                  <Phone className="w-3 h-3 flex-shrink-0 text-zinc-400" />
                                  <a href={`tel:${vendor.phone.replace(/\s+/g, '')}`} className="hover:underline">
                                    {vendor.phone}
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* Pricing & Selection Actions */}
                            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
                              <div>
                                <span className="text-[9px] text-zinc-400 uppercase font-medium block">Starting</span>
                                <span className="font-semibold text-xs text-zinc-900">
                                  ₹{vendor.startingPrice.toLocaleString('en-IN')}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => setQuoteVendor(vendor)}
                                  className="px-2.5 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-medium transition-colors cursor-pointer"
                                >
                                  Quote
                                </button>
                                <button
                                  onClick={() => handleSelectVendor(item.categorySlug, vendor)}
                                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                                  }`}
                                >
                                  {isSelected ? '✓ Selected' : 'Select'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ADJUST TOTAL BUDGET MODAL */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-lg w-full border border-zinc-200 shadow-xl relative space-y-5">
            <button
              onClick={() => setShowAdjustModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="font-serif font-bold text-xl text-zinc-950">
                Adjust Event Budget
              </h3>
              <p className="text-xs text-zinc-500">
                Update your overall budget cap. Service allocations will recalculate automatically.
              </p>
            </div>

            <form onSubmit={handleApplyNewBudget} className="space-y-4">
              {/* Presets */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Preset Amounts
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                  {BUDGET_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.value}
                      onClick={() => setTempBudgetInput(preset.value)}
                      className={`py-1.5 px-2.5 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer ${
                        tempBudgetInput === preset.value
                          ? 'border-zinc-900 bg-zinc-900 text-white'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Custom Budget (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-zinc-400">₹</span>
                  <input
                    type="number"
                    min={10000}
                    step={5000}
                    value={tempBudgetInput}
                    onChange={(e) => setTempBudgetInput(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-950 focus:ring-2 focus:ring-zinc-900 focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quote Request Modal */}
      {quoteVendor && (
        <QuoteRequestModal
          vendorId={quoteVendor.id}
          vendorName={quoteVendor.businessName}
          rating={quoteVendor.rating}
          reviewCount={quoteVendor.reviewCount}
          startingPrice={quoteVendor.startingPrice}
          address={quoteVendor.address}
          onClose={() => setQuoteVendor(null)}
        />
      )}

      {/* Action Plan & Milestones */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-zinc-950">Event Milestones</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Checklist for coordinating your event in {city}
            </p>
          </div>
          <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-md">
            {completedTaskCount} of {tasks.length} Completed
          </span>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddMilestoneSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => {
                setNewTaskTitle(e.target.value);
                if (inputError) setInputError(false);
              }}
              placeholder="Add event milestone (e.g., Finalize flower entry arch)..."
              className={`flex-1 px-3.5 py-2 rounded-xl border text-xs font-medium focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all ${
                inputError ? 'border-rose-400 bg-rose-50/50' : 'border-zinc-200'
              }`}
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-800 focus:ring-2 focus:ring-zinc-900 focus:outline-none"
            >
              {MILESTONE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>

          {inputError && (
            <div className="flex items-center gap-1.5 text-rose-600 text-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Please enter a milestone description before adding.</span>
            </div>
          )}

          {/* Preset Suggested Quick-Add Chips */}
          <div className="pt-1">
            <span className="text-[11px] font-medium text-zinc-400 block mb-1.5">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_MILESTONES.map((preset) => {
                const isAdded = tasks.some((t) => t.title.toLowerCase() === preset.title.toLowerCase());
                return (
                  <button
                    type="button"
                    key={preset.title}
                    disabled={isAdded}
                    onClick={() => addPresetMilestone(preset)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed opacity-50'
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {isAdded ? `✓ ${preset.title}` : `+ ${preset.title}`}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        {/* Tasks List */}
        <div className="space-y-1.5 pt-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all group ${
                task.completed
                  ? 'bg-zinc-50/60 border-zinc-200/60 text-zinc-400'
                  : 'bg-white border-zinc-200/80 text-zinc-900 hover:border-zinc-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                    task.completed ? 'bg-zinc-900 text-white' : 'border border-zinc-300'
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
                <span className={`text-xs font-medium ${task.completed ? 'line-through text-zinc-400' : ''}`}>
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-medium">
                  {task.category}
                </span>
                <button
                  type="button"
                  onClick={(e) => deleteTask(task.id, e)}
                  title="Delete milestone"
                  className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default function MyEventPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-500">Loading Event Workspace...</div>}>
      <EventWorkspaceContent />
    </Suspense>
  );
}
