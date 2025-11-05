// src/lib/query/provider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { Toaster } from "sonner";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // ⬇️ nonaktifkan auto refresh saat kembali ke tab / jaringan tersambung lagi
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            // data dianggap fresh agak lama supaya tidak refetch diam-diam
            staleTime: 5 * 60 * 1000, // 5 menit
            gcTime: 30 * 60 * 1000, // 30 menit
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster richColors />
    </QueryClientProvider>
  );
}
