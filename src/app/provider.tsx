
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { Toaster } from "sonner";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,      
            gcTime: 30 * 60 * 1000,        
            refetchOnWindowFocus: false,   
            refetchOnReconnect: false,     
            refetchOnMount: false,         
            retry: 1,
          }
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
