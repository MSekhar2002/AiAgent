import React, { createContext, useReducer, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import absenceReducer from '../reducers/absenceReducer';

// Create context
export const AbsenceContext = createContext();

// Initial state
const initialState = {
  absences: [],
  userAbsences: [],
  pendingAbsences: [],
  currentAbsence: null,
  loading: true,
  error: null,
  success: null
};

// Provider component
export const AbsenceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(absenceReducer, initialState);

  // Get all absences (admin only)
  const getAbsences = async () => {
    try {
      setLoading();
      const res = await axiosInstance.get('/absences');

      dispatch({
        type: 'GET_ABSENCES',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'ABSENCE_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch absences'
      });
    }
  };

  // Get user's absences
  const getUserAbsences = async () => {
    try {
      setLoading();
      const res = await axiosInstance.get('/absences/user');

      dispatch({
        type: 'GET_USER_ABSENCES',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'ABSENCE_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch your absences'
      });
    }
  };

  // Get pending absences (admin only)
  const getPendingAbsences = async () => {
    try {
      setLoading();
      const res = await axiosInstance.get('/absences/pending');

      dispatch({
        type: 'GET_PENDING_ABSENCES',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'ABSENCE_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch pending absences'
      });
    }
  };

  // Get absence by ID
  const getAbsenceById = async (id) => {
    try {
      setLoading();
      const res = await axiosInstance.get(`/absences/${id}`);

      dispatch({
        type: 'GET_ABSENCE',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'ABSENCE_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch absence details'
      });
    }
  };

  // Create new absence
  const createAbsence = async (formData) => {
    try {
      setLoading();
      const res = await axiosInstance.post('/absences', formData);

      dispatch({
        type: 'CREATE_ABSENCE',
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'ABSENCE_ERROR',
        payload: err.response?.data?.msg || 'Failed to create absence request'
      });
      throw err;
    }
  };

  // Update absence status (admin only)
  const updateAbsenceStatus = async (id, status) => {
    try {
      setLoading();
      const res = await axiosInstance.put(`/absences/${id}/status`, { status });

      dispatch({
        type: 'UPDATE_ABSENCE',
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'ABSENCE_ERROR',
        payload: err.response?.data?.msg || 'Failed to update absence status'
      });
      throw err;
    }
  };

  // Delete absence
  const deleteAbsence = async (id) => {
    try {
      await axiosInstance.delete(`/absences/${id}`);

      dispatch({
        type: 'DELETE_ABSENCE',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'ABSENCE_ERROR',
        payload: err.response?.data?.msg || 'Failed to delete absence'
      });
    }
  };

  // Set loading
  const setLoading = () => dispatch({ type: 'SET_LOADING' });

  // Clear errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  // Clear success message
  const clearSuccess = () => dispatch({ type: 'CLEAR_SUCCESS' });

  return (
    <AbsenceContext.Provider
      value={{
        absences: state.absences,
        userAbsences: state.userAbsences,
        pendingAbsences: state.pendingAbsences,
        currentAbsence: state.currentAbsence,
        loading: state.loading,
        error: state.error,
        success: state.success,
        getAbsences,
        getUserAbsences,
        getPendingAbsences,
        getAbsenceById,
        createAbsence,
        updateAbsenceStatus,
        deleteAbsence,
        clearErrors,
        clearSuccess
      }}
    >
      {children}
    </AbsenceContext.Provider>
  );
};