'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * Makes react-query available to every hook built in src/hooks/*.
 *
 * Why this needs its own file: react-query's <QueryClientProvider> uses
 * React context, which only works in a Client Component ('use client').
 * src/app/layout.tsx is a Server Component (it reads cookies() directly),
 * so the provider can't just live there — it's wrapped in this small client
 * component instead, and layout.tsx renders it around {children}.
 *
 * Why `useState(() => new QueryClient())` instead of just
 * `const queryClient = new QueryClient()`: creating it during render would
 * build a brand new client (and throw away all cached data) on every
 * re-render. useState's lazy initializer only runs once per component
 * instance, so the same client sticks around for the whole session.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered "fresh" for 60s after fetching, so
            // navigating between pages that show the same data (e.g. the
            // tutor list) doesn't immediately refire the request.
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
