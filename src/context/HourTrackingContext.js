import React, { createContext, useReducer, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import hourTrackingReducer from '../reducers/hourTrackingReducer';

// Create context
export const HourTrackingContext = createContext();

// Initial state
const initialState = {
  records: [],
  userRecords: [],
  currentRecord: null,
  activeSession: null,
  reports: null,
  loading: true,
  error: null,
  success: null
};

// Provider component
export const HourTrackingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(hourTrackingReducer, initialState);

  // Get all hour tracking records (admin only)
  const getRecords = async () => {
    try {
      setLoading();
      const res = await axiosInstance.get('/hour-tracking');

      dispatch({
        type: 'GET_RECORDS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'HOUR_TRACKING_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch hour tracking records'
      });
    }
  };

  // Get user's hour tracking records
  const getUserRecords = async () => {
    try {
      setLoading();
      const res = await axiosInstance.get('/hour-tracking/user');

      dispatch({
        type: 'GET_USER_RECORDS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'HOUR_TRACKING_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch your hour tracking records'
      });
    }
  };

  // Get hour tracking record by ID
  const getRecordById = async (id) => {
    try {
      setLoading();
      const res = await axiosInstance.get(`/hour-tracking/${id}`);

      dispatch({
        type: 'GET_RECORD',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'HOUR_TRACKING_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch record details'
      });
    }
  };

  // Check active session
  const checkActiveSession = async () => {
    try {
      setLoading();
      const res = await axiosInstance.get('/hour-tracking/active');

      dispatch({
        type: 'GET_ACTIVE_SESSION',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      // If 404, it means no active session which is not an error
      if (err.response && err.response.status === 404) {
        dispatch({
          type: 'GET_ACTIVE_SESSION',
          payload: null
        });
        return null;
      }
      
      dispatch({
        type: 'HOUR_TRACKING_ERROR',
        payload: err.response?.data?.msg || 'Failed to check active session'
      });
      return null;
    }
  };

  // Clock in
  const clockIn = async (scheduleId, notes = '') => {
    try {
      setLoading();
      const res = await axiosInstance.post('/hour-tracking/clock-in', { 
        scheduleId, 
        notes 
      });

      dispatch({
        type: 'CLOCK_IN',
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'HOUR_TRACKING_ERROR',
        payload: err.response?.data?.msg || 'Failed to clock in'
      });
      throw err;
    }
  };

  // Clock out
  const clockOut = async (id, notes = '') => {
    try {
      setLoading();
      const res = await axiosInstance.put(`/hour-tracking/${id}/clock-out`, { notes });

      dispatch({
        type: 'CLOCK_OUT',
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'HOUR_TRACKING_ERROR',
        payload: err.response?.data?.msg || 'Failed to clock out'
      });
      throw err;
    }
  };

  // Get reports
  const getReports = async (startDate, endDate, userId = null) => {
    try {
      setLoading();
      let url = '/hour-tracking/reports';
      const params = new URLSearchParams();
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (userId) params.append('userId', userId);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const res = await axiosInstance.get(url);

      dispatch({
        type: 'GET_REPORTS',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'HOUR_TRACKING_ERROR',
        payload: err.response?.data?.msg || 'Failed to generate reports'
      });
      throw err;
    }
  };

  // Set loading
  const setLoading = () => dispatch({ type: 'SET_LOADING' });

  // Clear errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  // Clear success message
  const clearSuccess = () => dispatch({ type: 'CLEAR_SUCCESS' });

  return (
    <HourTrackingContext.Provider
      value={{
        records: state.records,
        userRecords: state.userRecords,
        currentRecord: state.currentRecord,
        activeSession: state.activeSession,
        reports: state.reports,
        loading: state.loading,
        error: state.error,
        success: state.success,
        getRecords,
        getUserRecords,
        getRecordById,
        checkActiveSession,
        clockIn,
        clockOut,
        getReports,
        clearErrors,
        clearSuccess
      }}
    >
      {children}
    </HourTrackingContext.Provider>
  );
};