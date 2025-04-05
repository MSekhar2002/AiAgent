import React from 'react';
import { Navigate } from 'react-router-dom';
import WhatsAppDashboard from './WhatsAppDashboard';

// This component serves as a wrapper to ensure only admins can access WhatsApp settings
const WhatsAppSettings = ({ user }) => {
  // Check if user is admin
  if (user && user.role === 'admin') {
    return <WhatsAppDashboard />;
  }
  
  // Redirect non-admin users
  return <Navigate to="/" replace />;
};

export default WhatsAppSettings;