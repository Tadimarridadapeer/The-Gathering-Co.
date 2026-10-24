'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocationProvider } from '@/lib/location-context';
import { LocationPermissionModal } from '@/components/ui/LocationPermissionModal';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        {children}
        <LocationPermissionModal />
      </LocationProvider>
    </QueryClientProvider>
  );
}
