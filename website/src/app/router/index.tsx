import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '../../pages/LoginPage'
import DashboardPage from '../../pages/DashboardPage'
import AdminPage from '../../pages/AdminPage'
import AttendancePage from '../../pages/AttendancePage'
import EmployeePage from '../../pages/EmployeePage'
import DevicePage from '../../pages/DevicePage'
import LogDevicePage from '../../pages/LogDevicePage'

export const AppRouter = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/admin',
    element: <AdminPage />,
  },
  {
    path: '/attendance',
    element: <AttendancePage />,
  },
  {
    path: '/employee',
    element: <EmployeePage />,
  },
  {
    path: '/device',
    element: <DevicePage />,
  },
  {
    path: '/attendance',
    element: <AttendancePage />,
  },
  {
    path: '/log-device',
    element: <LogDevicePage />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])