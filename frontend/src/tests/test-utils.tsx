/* eslint-disable react-refresh/only-export-components */

import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

function AllProviders({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <GoogleOAuthProvider clientId="test-client-id">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export function renderWithProviders(ui: React.ReactElement) {
  return render(ui, {
    wrapper: AllProviders,
  });
}
