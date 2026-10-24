export interface ServiceLocation {
  city: string;
  state: string;
  status: 'ACTIVE' | 'EXPANDING' | 'COMING_SOON';
  vendorCountLabel: string;
  badge: string;
  active: boolean;
}

export const SERVICE_LOCATIONS: ServiceLocation[] = [
  {
    city: 'Anantapur',
    state: 'Andhra Pradesh',
    status: 'ACTIVE',
    vendorCountLabel: '120+ Verified Vendors',
    badge: 'Live & Active',
    active: true,
  },
  {
    city: 'Kurnool',
    state: 'Andhra Pradesh',
    status: 'EXPANDING',
    vendorCountLabel: 'Field Team On-Ground',
    badge: 'Expanding Locally',
    active: false,
  },
  {
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    status: 'EXPANDING',
    vendorCountLabel: 'Vetting Vendors',
    badge: 'Expanding Locally',
    active: false,
  },
  {
    city: 'Kadapa',
    state: 'Andhra Pradesh',
    status: 'ACTIVE',
    vendorCountLabel: '34+ Verified Vendors',
    badge: 'Live & Active',
    active: true,
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    status: 'COMING_SOON',
    vendorCountLabel: 'Regional Expansion',
    badge: 'Coming Soon',
    active: false,
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    status: 'COMING_SOON',
    vendorCountLabel: 'Metro Expansion',
    badge: 'Coming Soon',
    active: false,
  },
];

export function isLocationActive(cityName: string): boolean {
  if (!cityName) return false;
  const match = SERVICE_LOCATIONS.find(
    (l) => l.city.toLowerCase() === cityName.trim().toLowerCase()
  );
  return match?.status === 'ACTIVE';
}

export function getLocationDetails(cityName: string): ServiceLocation {
  const match = SERVICE_LOCATIONS.find(
    (l) => l.city.toLowerCase() === cityName.trim().toLowerCase()
  );
  if (match) return match;
  return {
    city: cityName,
    state: 'India',
    status: 'EXPANDING',
    vendorCountLabel: 'Field Team Onboarding',
    badge: 'Expanding Locally',
    active: false,
  };
}
