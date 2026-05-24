import {
  createBrowserRouter,
} from 'react-router-dom';

import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

import DashboardPage from '../../pages/DashboardPage';
import AttendancePage from '../../pages/AttendancePage';
import LoginPage from '../../pages/LoginPage';

export const router = createBrowserRouter([
  {
    element: <DashboardLayout />,
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/attendance',
        element: <AttendancePage />,
      },
    ],
  },

  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
]);