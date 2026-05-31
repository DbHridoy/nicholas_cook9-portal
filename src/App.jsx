import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import SetPassword from './pages/SetPassword';
import ResetSuccess from './pages/ResetSuccess';

// Layout
import DashboardLayout from './layouts/DashboardLayout';

// Shared route guard
import ProtectedRoute from './components/ProtectedRoute';

// Dealer pages
import DashboardMetrics from './pages/dashboard/DashboardMetrics';
import Sales from './pages/dashboard/Sales';
import SalesDetails from './pages/dashboard/SalesDetails';
import Reports from './pages/dashboard/Reports';
import ClaimDetails from './pages/dashboard/ClaimDetails';
import Products from './pages/dashboard/Products';

// Admin pages
import DealerList from './pages/dashboard/admin/DealerList';
import CreateDealer from './pages/dashboard/admin/CreateDealer';
import SalesAnalytics from './pages/dashboard/admin/SalesAnalytics';
import DealerDetails from './pages/dashboard/admin/DealerDetails';
import Claims from './pages/dashboard/admin/Claims';
import AdminClaimDetails from './pages/dashboard/admin/AdminClaimDetails';

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/verify-otp', element: <VerifyOTP /> },
  { path: '/set-password', element: <SetPassword /> },
  { path: '/reset-success', element: <ResetSuccess /> },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      // ── Shared / Dealer routes ───────────────────────────────
      {
        path: '',
        element: <DashboardMetrics />,
      },
      {
        path: 'sales',
        element: (
          <ProtectedRoute role="dealer">
            <Sales />
          </ProtectedRoute>
        ),
      },
      {
        path: 'sales/:id',
        element: (
          <ProtectedRoute role="dealer">
            <SalesDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products',
        element: (
          <ProtectedRoute role="dealer">
            <Products />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <ProtectedRoute role="dealer">
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reports/:id',
        element: (
          <ProtectedRoute role="dealer">
            <ClaimDetails />
          </ProtectedRoute>
        ),
      },

      // ── Admin-only routes ────────────────────────────────────
      {
        path: 'dealers',
        element: (
          <ProtectedRoute role="admin">
            <DealerList />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dealers/create',
        element: (
          <ProtectedRoute role="admin">
            <CreateDealer />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dealers/:id',
        element: (
          <ProtectedRoute role="admin">
            <DealerDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: 'analytics',
        element: (
          <ProtectedRoute role="admin">
            <SalesAnalytics />
          </ProtectedRoute>
        ),
      },
      {
        path: 'complaints',
        element: (
          <ProtectedRoute role="admin">
            <Claims />
          </ProtectedRoute>
        ),
      },
      {
        path: 'complaints/:id',
        element: (
          <ProtectedRoute role="admin">
            <AdminClaimDetails />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
