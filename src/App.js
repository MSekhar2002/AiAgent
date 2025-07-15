import React, {useContext, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TeamManagement from './components/teams/TeamManagement';
import TeamSetup from './components/auth/TeamSetup';

// Context Providers
import { AuthContext, AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LocationProvider } from './context/LocationContext';
import { AbsenceProvider } from './context/AbsenceContext';
import { HourTrackingProvider } from './context/HourTrackingContext';
import { LanguageProvider } from './context/LanguageContext';
import { TrafficProvider } from './context/TrafficContext';

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

// Absence Management Pages
import AbsenceManagement from './components/absence/AbsenceManagement';

// Hour Tracking Pages
import HourTracking from './components/hourTracking/HourTracking';

// Language Settings Pages
import LanguageSettings from './components/language/LanguageSettings';

// Traffic Awareness Pages
import TrafficAwareness from './components/traffic/TrafficAwareness';
import { TeamContext, TeamProvider } from './context/TeamContext';
import UserManagement from './components/users/UserManagement';

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
  useEffect(() => {
    // Add a small delay to ensure React is fully mounted
    const timer = setTimeout(() => {
      // Define the function on window first
      window.googleTranslateElementInit = () => {
        try {
          if (window.google && window.google.translate) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: "en",
                includedLanguages: "en,fr",
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              },
              "google_translate_element"
            );
          }
        } catch (error) {
          console.log('Google Translate loading error:', error);
        }
      };
  
      // Check if script already exists
      if (!document.querySelector('script[src*="translate.google.com"]')) {
        const addScript = document.createElement("script");
        addScript.setAttribute(
          "src",
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        );
        addScript.async = true;
        addScript.onerror = () => console.log('Failed to load Google Translate script');
        document.body.appendChild(addScript);
      }
    }, 1000); // 1 second delay
  
    return () => clearTimeout(timer);
  }, []);
  return (
    <ThemeProvider theme={theme}>
  <style>
    {`
      .goog-te-gadget img {
        display: none; 
      }

      .skiptranslate iframe {
            display: none !important;
          }

        .goog-te-gadget-simple{
            border-radius: 5px
        }

        .goog-te-gadget-simple span a span {
        margin-right:5px
        }
    `}
  </style>    
<div id="google_translate_element" style={{
  position: 'fixed',
  top: '18px',
  right: '145px',
  zIndex: 9999
}}></div>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <NotificationProvider>
            <LocationProvider>
              <AbsenceProvider>
                <HourTrackingProvider>
                  <LanguageProvider>
                    <TrafficProvider>
                      <TeamProvider>
            <Router>
              <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/team-setup" element={
                <PrivateRoute>
                  <TeamSetup />
                </PrivateRoute>
              } />
              <Route path="/" element={
                <PrivateRoute>
                  <TeamRequiredRoute>
                    <Dashboard />
                  </TeamRequiredRoute>
                </PrivateRoute>
              }>
                {/* Dashboard Home */}
                <Route index element={<DashboardHome />} />
                
                {/* User Routes */}
                <Route path="profile" element={<Profile />} />
                {/* <Route path="users" element={<AdminRoute><UsersList /></AdminRoute>} /> */}
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
                
                {/* Absence Management Routes */}
                <Route path="absences" element={<AbsenceManagement />} />
                
                {/* Hour Tracking Routes */}
                <Route path="hours" element={<HourTracking />} />
                
                {/* Language Settings Routes */}
                <Route path="language" element={<LanguageSettings />} />
                
                {/* Traffic Awareness Routes */}
                <Route path="traffic" element={<TrafficAwareness />} />
              {/* Team Management Routes */}
              // Update the users route to be accessible by all team members
              // (The admin-only restriction will be handled within the component)
              <Route path="users" element={<TeamRequiredRoute><UserManagement /></TeamRequiredRoute>} />
              <Route path="users/new" element={<TeamRequiredRoute><AdminRoute><UserForm /></AdminRoute></TeamRequiredRoute>} />
              <Route path="users/:id" element={<TeamRequiredRoute><AdminRoute><UserForm /></AdminRoute></TeamRequiredRoute>} />
              
              // Remove the separate teams route
              // <Route path="teams" element={<TeamManagement />} /> - Remove this line
              
              </Route>
              
              {/* Redirect to dashboard if already logged in */}
              <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router></TeamProvider>
                    </TrafficProvider>
                  </LanguageProvider>
                </HourTrackingProvider>
              </AbsenceProvider>
            </LocationProvider>
          </NotificationProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

// Add a new route guard for team requirement
const TeamRequiredRoute = ({ children }) => {
  const { team, loading: teamLoading, error } = useContext(TeamContext);
  const { user, loading: authLoading, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Only navigate when both auth and team loading are complete
    if (!authLoading && !teamLoading && isAuthenticated && !team && (error || team === null)) {
      navigate('/team-setup');
    }
  }, [team, teamLoading, authLoading, error, navigate, isAuthenticated]);

  // Show loading while either auth or team is loading
  // if (authLoading || teamLoading) return null;
  
  return team ? children : null;
};

export default App;