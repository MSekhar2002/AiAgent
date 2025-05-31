import React, { createContext, useReducer } from 'react';
import axiosInstance from '../utils/axiosConfig';
import trafficReducer from '../reducers/trafficReducer';

// Create context
export const TrafficContext = createContext();

// Initial state
const initialState = {
  commuteInfo: null,
  routeDetails: null,
  loading: false,
  error: null
};

// Provider component
export const TrafficProvider = ({ children }) => {
  const [state, dispatch] = useReducer(trafficReducer, initialState);

  // Get commute information for today's schedules
  const getCommuteInfo = async () => {
    try {
      setLoading();
      const res = await axiosInstance.get('/traffic/commute');

      dispatch({
        type: 'GET_COMMUTE_INFO',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'TRAFFIC_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch commute information'
      });
      return null;
    }
  };

  // Get route details between two locations
  const getRouteDetails = async (originId, destinationId) => {
    try {
      setLoading();
      const res = await axiosInstance.get(`/traffic/route?origin=${originId}&destination=${destinationId}`);

      dispatch({
        type: 'GET_ROUTE_DETAILS',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'TRAFFIC_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch route details'
      });
      return null;
    }
  };

  // Set loading
  const setLoading = () => dispatch({ type: 'SET_LOADING' });

  // Clear errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  return (
    <TrafficContext.Provider
      value={{
        commuteInfo: state.commuteInfo,
        routeDetails: state.routeDetails,
        loading: state.loading,
        error: state.error,
        getCommuteInfo,
        getRouteDetails,
        clearErrors
      }}
    >
      {children}
    </TrafficContext.Provider>
  );
};