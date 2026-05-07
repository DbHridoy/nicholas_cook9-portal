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
import Reports from './pages/dashboard/Reports';

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
        path: "reports",
        element: <Reports />,
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
