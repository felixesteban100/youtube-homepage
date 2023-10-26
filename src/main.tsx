import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClientProvider, QueryClient } from 'react-query';
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-react";
import { dark } from '@clerk/themes'

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) throw "Missing Publishable Key";

export const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={clerkPubKey}
          appearance={{
            baseTheme: (localStorage.getItem('vite-ui-theme') === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) || localStorage.getItem('vite-ui-theme') === "dark" ? dark : undefined
          }}
        >
          <ClerkLoaded>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
          </ThemeProvider>
          </ClerkLoaded>
        </ClerkProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
