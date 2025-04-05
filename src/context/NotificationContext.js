import React, { createContext, useReducer } from 'react';
import axiosInstance from '../utils/axiosConfig';
import notificationReducer from '../reducers/notificationReducer';

// Create context
export const NotificationContext = createContext();

// Initial state
const initialState = {
  notifications: [],
  notification: null,
  loading: true,
  error: null
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Get all notifications for the current user
  const getNotifications = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axiosInstance.get('/notifications');

      dispatch({
        type: 'GET_NOTIFICATIONS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'NOTIFICATION_ERROR',
        payload: err.response?.data.msg || 'Failed to fetch notifications'
      });
    }
  };

  // Get all notifications (admin view)
  const getAdminNotifications = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axiosInstance.get('/notifications/admin');

      dispatch({
        type: 'GET_NOTIFICATIONS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'NOTIFICATION_ERROR',
        payload: err.response?.data.msg || 'Failed to fetch notifications'
      });
    }
  };

  // Get notification by ID
  const getNotification = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axiosInstance.get(`/notifications/${id}`);

      dispatch({
        type: 'GET_NOTIFICATION',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'NOTIFICATION_ERROR',
        payload: err.response?.data.msg || 'Failed to fetch notification'
      });
    }
  };

  // Create notification
  const createNotification = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axiosInstance.post('/notifications', formData, config);

      dispatch({
        type: 'CREATE_NOTIFICATION',
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'NOTIFICATION_ERROR',
        payload: err.response?.data.msg || 'Failed to create notification'
      });
      throw err;
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const res = await axiosInstance.put(`/notifications/${id}/read`);

      dispatch({
        type: 'UPDATE_NOTIFICATION',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'NOTIFICATION_ERROR',
        payload: err.response?.data.msg || 'Failed to mark notification as read'
      });
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);

      dispatch({
        type: 'DELETE_NOTIFICATION',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'NOTIFICATION_ERROR',
        payload: err.response?.data.msg || 'Failed to delete notification'
      });
    }
  };

  // Send traffic alerts
  const sendTrafficAlerts = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axiosInstance.post('/notifications/traffic-alerts');

      dispatch({
        type: 'SEND_TRAFFIC_ALERTS',
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'NOTIFICATION_ERROR',
        payload: err.response?.data.msg || 'Failed to send traffic alerts'
      });
      throw err;
    }
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        notification: state.notification,
        loading: state.loading,
        error: state.error,
        getNotifications,
        getAdminNotifications,
        getNotification,
        createNotification,
        markAsRead,
        deleteNotification,
        sendTrafficAlerts,
        clearErrors
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};