import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { DashboardPage } from '@/pages/DashboardPage';
import { ProfilesPage } from '@/pages/DemoPage';
import { ApiKeysPage } from '@/pages/ApiKeysPage';
import { PricingPage } from '@/pages/PricingPage';
import { AccountPage } from '@/pages/AccountPage';
import { HelpPage } from '@/pages/HelpPage';
import { DocsPage } from '@/pages/DocsPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/profiles",
    element: <ProfilesPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/api-keys",
    element: <ApiKeysPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/account",
    element: <AccountPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/help",
    element: <HelpPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/docs",
    element: <DocsPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)