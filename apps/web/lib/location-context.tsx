'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  city: string;
  state: string;
  area: string;
  postcode?: string;
  country: string;
  isGPS: boolean;
  coordinates?: Coordinates;
}

interface LocationContextType {
  location: LocationData;
  isDetecting: boolean;
  error: string | null;
  permissionStatus: 'prompt' | 'granted' | 'denied' | 'unsupported';
  showPromptModal: boolean;
  setShowPromptModal: (show: boolean) => void;
  requestCurrentLocation: () => Promise<boolean>;
  setCityManually: (city: string, state?: string) => void;
  dismissPrompt: () => void;
}

const DEFAULT_LOCATION: LocationData = {
  city: 'Anantapur',
  state: 'Andhra Pradesh',
  area: 'Kamala Nagar',
  country: 'India',
  isGPS: false,
};

// Known South Indian / AP reference hubs for fallback distance calculation
const KNOWN_HUBS = [
  { name: 'Anantapur', state: 'Andhra Pradesh', lat: 14.6819, lon: 77.6006 },
  { name: 'Kurnool', state: 'Andhra Pradesh', lat: 15.8281, lon: 78.0373 },
  { name: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lon: 79.4192 },
  { name: 'Kadapa', state: 'Andhra Pradesh', lat: 14.4673, lon: 78.8242 },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867 },
  { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lon: 80.6480 },
  { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lon: 80.4365 },
  { name: 'Nellore', state: 'Andhra Pradesh', lat: 14.4426, lon: 79.9865 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lon: 83.2185 },
];

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestHub(lat: number, lon: number) {
  let nearest = KNOWN_HUBS[0];
  let minDistance = Infinity;

  for (const hub of KNOWN_HUBS) {
    const dist = getDistanceKm(lat, lon, hub.lat, hub.lon);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = hub;
    }
  }

  return { nearest, distanceKm: minDistance };
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    'prompt' | 'granted' | 'denied' | 'unsupported'
  >('prompt');
  const [showPromptModal, setShowPromptModal] = useState(false);

  // Initialize and check persisted location & permission
  useEffect(() => {
    try {
      const saved = localStorage.getItem('thegatheringco_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.city) {
          setLocation(parsed);
        }
      }

      const dismissed = sessionStorage.getItem('thegatheringco_location_prompt_dismissed');

      if (!navigator.geolocation) {
        setPermissionStatus('unsupported');
        return;
      }

      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions
          .query({ name: 'geolocation' })
          .then((permissionDesc) => {
            setPermissionStatus(permissionDesc.state as any);

            if (permissionDesc.state === 'granted') {
              // Silently refresh current location
              fetchCurrentPosition(false);
            } else if (permissionDesc.state === 'prompt' && !dismissed) {
              // Show prompt after a short delay so the user understands why
              const timer = setTimeout(() => {
                setShowPromptModal(true);
              }, 1200);
              return () => clearTimeout(timer);
            }

            permissionDesc.onchange = () => {
              setPermissionStatus(permissionDesc.state as any);
              if (permissionDesc.state === 'granted') {
                fetchCurrentPosition(true);
              }
            };
          })
          .catch(() => {
            // Fallback for browsers not supporting permissions.query
            if (!dismissed) {
              const timer = setTimeout(() => setShowPromptModal(true), 1200);
              return () => clearTimeout(timer);
            }
          });
      } else if (!dismissed) {
        const timer = setTimeout(() => setShowPromptModal(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('Location initialization error:', e);
    }
  }, []);

  const reverseGeocode = async (latitude: number, longitude: number): Promise<LocationData> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      // Attempt OpenStreetMap Nominatim reverse geocoding
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};

        const city =
          addr.city ||
          addr.town ||
          addr.village ||
          addr.suburb ||
          addr.municipality ||
          addr.county ||
          addr.state_district ||
          findNearestHub(latitude, longitude).nearest.name;

        const area =
          addr.residential ||
          addr.neighbourhood ||
          addr.suburb ||
          addr.road ||
          addr.hamlet ||
          '';

        const state = addr.state || 'Andhra Pradesh';
        const postcode = addr.postcode || '';
        const country = addr.country || 'India';

        return {
          city,
          state,
          area,
          postcode,
          country,
          isGPS: true,
          coordinates: { latitude, longitude },
        };
      }
    } catch (err) {
      console.warn('Reverse geocoding via Nominatim timed out or failed, calculating nearest hub:', err);
    }

    // Mathematical nearest hub fallback
    const { nearest } = findNearestHub(latitude, longitude);
    return {
      city: nearest.name,
      state: nearest.state,
      area: 'Detected via GPS',
      country: 'India',
      isGPS: true,
      coordinates: { latitude, longitude },
    };
  };

  const fetchCurrentPosition = useCallback(async (isUserInitiated = true): Promise<boolean> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setPermissionStatus('unsupported');
      return false;
    }

    setIsDetecting(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const resolvedLocation = await reverseGeocode(latitude, longitude);

            setLocation(resolvedLocation);
            setPermissionStatus('granted');
            setShowPromptModal(false);

            try {
              localStorage.setItem('thegatheringco_location', JSON.stringify(resolvedLocation));
            } catch (e) {}

            setIsDetecting(false);
            resolve(true);
          } catch (err: any) {
            console.error('Failed to resolve coordinates:', err);
            setError('Could not translate GPS coordinates to an address.');
            setIsDetecting(false);
            resolve(false);
          }
        },
        (err) => {
          setIsDetecting(false);
          if (err.code === err.PERMISSION_DENIED) {
            setPermissionStatus('denied');
            setError('Location permission was denied. You can select your city manually.');
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            setError('Location information is currently unavailable.');
          } else if (err.code === err.TIMEOUT) {
            setError('Location request timed out. Please try again.');
          } else {
            setError('An unknown error occurred while requesting location.');
          }
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 120000,
        }
      );
    });
  }, []);

  const requestCurrentLocation = useCallback(async () => {
    return await fetchCurrentPosition(true);
  }, [fetchCurrentPosition]);

  const setCityManually = useCallback((city: string, state: string = 'Andhra Pradesh') => {
    const updated: LocationData = {
      city,
      state,
      area: '',
      country: 'India',
      isGPS: false,
    };
    setLocation(updated);
    setShowPromptModal(false);
    try {
      localStorage.setItem('thegatheringco_location', JSON.stringify(updated));
    } catch (e) {}
  }, []);

  const dismissPrompt = useCallback(() => {
    setShowPromptModal(false);
    try {
      sessionStorage.setItem('thegatheringco_location_prompt_dismissed', 'true');
    } catch (e) {}
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        isDetecting,
        error,
        permissionStatus,
        showPromptModal,
        setShowPromptModal,
        requestCurrentLocation,
        setCityManually,
        dismissPrompt,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
