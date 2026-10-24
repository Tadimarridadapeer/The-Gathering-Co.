export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    // Server runtime (Vercel Service Binding or environment URL)
    return process.env.API_SERVICE_URL || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  }
  // Browser client runtime: relative to current origin on production, or port 4000 on localhost
  return process.env.NEXT_PUBLIC_API_URL ?? (window.location.hostname === 'localhost' && window.location.port === '3000' ? 'http://localhost:4000' : '');
}

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const base = getApiBaseUrl();
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const apiPath = formattedEndpoint.startsWith('/api') ? formattedEndpoint : `/api${formattedEndpoint}`;
    const url = base ? new URL(apiPath, base).toString() : apiPath;

    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`Fetch error for endpoint ${endpoint}, utilizing fallback payload`, error);
    throw error;
  }
}

// Helper data fallbacks for instant client-side rendering
export const ANANTAPUR_CATEGORIES = [
  { name: 'Wedding', slug: 'wedding', icon: 'Heart', count: '120+ Vendors' },
  { name: 'Engagement', slug: 'engagement', icon: 'Sparkles', count: '80+ Vendors' },
  { name: 'Reception', slug: 'reception', icon: 'GlassWater', count: '90+ Vendors' },
  { name: 'Birthday', slug: 'birthday', icon: 'Cake', count: '65+ Vendors' },
  { name: 'Baby Shower', slug: 'baby-shower', icon: 'Baby', count: '40+ Vendors' },
  { name: 'Housewarming', slug: 'housewarming', icon: 'Home', count: '55+ Vendors' },
  { name: 'Religious Event', slug: 'religious-event', icon: 'Flame', count: '70+ Vendors' },
  { name: 'Private Party', slug: 'private-party', icon: 'Music', count: '45+ Vendors' },
  { name: 'Corporate', slug: 'corporate-event', icon: 'Briefcase', count: '30+ Vendors' },
];

export const VENDOR_CATEGORIES = [
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
  'Return Gifts',
  'Purohits',
];
