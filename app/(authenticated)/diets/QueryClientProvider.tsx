"use client";
import { QueryClient, QueryClientProvider as QCP } from "@tanstack/react-query";

export function QueryClientProvider({ children }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000 },
    },
  });
  return <QCP client={queryClient}>{children}</QCP>;
}
