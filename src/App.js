import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LocationProvider } from './context/LocationContext';

// Layout Components
import Dashboard from './components/layout/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard Pages
import DashboardHome from './components/dashboard/DashboardHome';

// User Pages
import Profile from './components/users/Profile';
import UsersList from './components/users/UsersList';
import UserForm from './components/users/UserForm';

// Schedule Pages
import SchedulesList from './components/schedules/SchedulesList';
import ScheduleDetail from './components/schedules/ScheduleDetail';
import ScheduleForm from './components/schedules/ScheduleForm';

// Location Pages
import LocationsList from './components/locations/LocationsList';
import LocationDetail from './components/locations/LocationDetail';
import LocationForm from './components/locations/LocationForm';

// Notification Pages
import NotificationsList from './components/notifications/NotificationsList';
import NotificationDetail from './components/notifications/NotificationDetail';
import NotificationForm from './components/notifications/NotificationForm';

// WhatsApp Integration Pages
import WhatsAppDashboard from './components/whatsapp/WhatsAppDashboard';
import WhatsAppSettings from './components/whatsapp/WhatsAppSettings';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <LocationProvider>
            <Router>
              <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Private Routes */}
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
                {/* Dashboard Home */}
                <Route index element={<DashboardHome />} />
                
                {/* User Routes */}
                <Route path="profile" element={<Profile />} />
                <Route path="users" element={<AdminRoute><UsersList /></AdminRoute>} />
                <Route path="users/new" element={<AdminRoute><UserForm /></AdminRoute>} />
                <Route path="users/:id" element={<AdminRoute><UserForm /></AdminRoute>} />
                
                {/* Schedule Routes */}
                <Route path="schedules" element={<SchedulesList />} />
                <Route path="schedules/:id" element={<ScheduleDetail />} />
                <Route path="schedules/new" element={<AdminRoute><ScheduleForm /></AdminRoute>} />
                <Route path="schedules/edit/:id" element={<AdminRoute><ScheduleForm /></AdminRoute>} />
                
                {/* Location Routes */}
                <Route path="locations" element={<LocationsList />} />
                <Route path="locations/:id" element={<LocationDetail />} />
                <Route path="locations/new" element={<AdminRoute><LocationForm /></AdminRoute>} />
                <Route path="locations/edit/:id" element={<AdminRoute><LocationForm /></AdminRoute>} />
                
                {/* Notification Routes */}
                <Route path="notifications" element={<NotificationsList />} />
                <Route path="notifications/:id" element={<NotificationDetail />} />
                <Route path="notifications/new" element={<AdminRoute><NotificationForm /></AdminRoute>} />
                
                {/* WhatsApp Integration Routes */}
                <Route path="whatsapp" element={<AdminRoute><WhatsAppDashboard /></AdminRoute>} />
              </Route>
              
              {/* Redirect to dashboard if already logged in */}
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </LocationProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;