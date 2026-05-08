import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import SetPassword from './pages/SetPassword';
import ResetSuccess from './pages/ResetSuccess';

// Dashboard pages
import DashboardLayout from './layouts/DashboardLayout';
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
import Complaints from './pages/dashboard/admin/Complaints';
import ComplaintDetails from './pages/dashboard/admin/ComplaintDetails';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOTP />,
  },
  {
    path: "/set-password",
    element: <SetPassword />,
  },
  {
    path: "/reset-success",
    element: <ResetSuccess />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "",
        element: <DashboardMetrics />,
      },
      {
        path: "sales",
        element: <Sales />,
      },
      {
        path: "sales/:id",
        element: <SalesDetails />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "reports/:id",
        element: <ClaimDetails />,
      },
      // Admin routes
      {
        path: "dealers",
        element: <DealerList />,
      },
      {
        path: "dealers/create",
        element: <CreateDealer />,
      },
      {
        path: "dealers/:id",
        element: <DealerDetails />,
      },
      {
        path: "analytics",
        element: <SalesAnalytics />,
      },
      {
        path: "complaints",
        element: <Complaints />,
      },
      {
        path: "complaints/:id",
        element: <ComplaintDetails />,
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
